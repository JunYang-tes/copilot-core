"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function grep(op, list) {
    let test = new RegExp(op.strings.join(" "));
    return list.filter(item => test.test(item.value));
}
exports.grep = grep;
function head(op, list) {
    let n = Number(op.strings[0]);
    if (n > list.length) {
        return [...list];
    }
    return list.slice(0, n);
}
exports.head = head;
function tail(op, list) {
    let n = Number(op.strings[0]);
    if (n > list.length) {
        return [...list];
    }
    return list.slice(-n, list.length);
}
exports.tail = tail;
function count(op, list) {
    return [{
            title: "Count",
            text: list.length,
            value: list.length
        }];
}
exports.count = count;
function now() {
    let d = new Date();
    return [{
            title: "Now",
            text: d.toLocaleString(),
            value: d.getTime()
        }];
}
exports.now = now;
function toPipe(op) {
    return [Object.assign({}, op)];
}
exports.toPipe = toPipe;
const scalc = require("scalc");
function calc(op) {
    let exp = op.strings.join(" ").trim();
    if (exp.length) {
        let result = scalc(exp);
        return [{
                title: result,
                text: `${exp} = ${result}`,
                value: ""
            }];
    }
    else {
        return [{
                title: "Calculator",
                text: "Calculate math expression"
            }];
    }
}
exports.calc = calc;
