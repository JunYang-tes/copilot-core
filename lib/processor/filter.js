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
function search() {
}
exports.search = search;
