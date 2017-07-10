"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { debug } = require("b-logger")("copilot.processor.filter");
function grep(op, list) {
    let flags = "";
    let field = op.field || "value";
    if (op.i) {
        flags = "i";
    }
    debug("grep ", op);
    debug(op.strings.join("-"));
    const test = new RegExp(op.strings.join(" "), flags);
    debug(test);
    return list.filter((item) => {
        return test.test(item.value);
    });
}
exports.grep = grep;
const Fuse = require("fuse.js");
function search(op, list) {
    let keys = ["value"];
    if (op.keys && Array.isArray(op.keys)) {
        keys = op.keys;
    }
    const options = {
        shouldSort: true,
        includeScore: true,
        includeMatches: true,
        threshold: 0.6,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        minMatchCharLength: 1,
        keys,
    };
    const fuse = new Fuse(list, options);
    debug("search ", op.strings.join(" "));
    let result = fuse.search(op.strings.join(" "));
    if (op.strings.length === 0) {
        return list;
    }
    return result.map(ret => {
        debug(ret);
        for (let match of ret.matches) {
            let key = match.key;
            let orignal = ret.item[key];
            if (key === "value") {
                ret.item.text = format(orignal, match.indices);
            }
        }
        return ret.item;
    });
}
exports.search = search;
function escape(input) {
    return input.replace(/\(/g, "((")
        .replace(/\)/g, "))");
}
function format(input, positions) {
    let result = [];
    let last = 0;
    for (let [start, end] of positions) {
        if (last !== start) {
            result.push(escape(input.slice(last, start)));
        }
        result.push(`(b)${escape(input.slice(start, end + 1))}(reset)`);
        last = end + 1;
    }
    if (last !== input.length) {
        result.push(escape(input.substring(last)));
    }
    return result.join();
}
