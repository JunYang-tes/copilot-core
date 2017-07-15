"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
    if (!Number.isFinite(n)) {
        return [{
                title: "Tail",
                text: "Select last nth items",
                value: "Select last nth items"
            }];
    }
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
    if (op.strings.length === 1) {
        let text = op.strings[0];
        return [{
                title: text,
                text,
                value: text
            }];
    }
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
                value: `${exp} = ${result}`,
                param: {
                    action: "copy",
                    field: "title"
                }
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
function echo(op) {
    let text = op.strings.join(" ");
    return [{
            title: text,
            text,
            value: text
        }];
}
exports.echo = echo;
function timeout(op, list) {
    let timeout = Number(op.min) * 60 * 1000 || Number(op.sec) * 1000 || 0;
    return list.map(item => ({
        title: "Do after time out",
        text: `After ${timeout / 1000}s ${item.title}`,
        value: `After ${timeout / 1000}s ${item.title}`,
        param: {
            action: "timeout",
            timeout,
            original: item
        }
    }));
}
exports.timeout = timeout;
function notify(op, list) {
    if (list.length) {
        return list.map(item => (Object.assign({}, item, { title: "Send notification", param: {
                action: "cmd",
                cmd: "notify-send",
                args: [item.title, item.value]
            } })));
    }
    else {
        let summary = op.summary || op.strings.join(" ");
        let body = op.body || "";
        return [{
                title: `Send notification`,
                text: summary,
                param: {
                    action: "cmd",
                    cmd: "notify-send",
                    args: [summary, body]
                }
            }];
    }
}
exports.notify = notify;
function copy(op, list) {
    let field = op.strings[0] || "value";
    return list.map(item => (Object.assign({}, item, { param: {
            action: "copy",
            field
        } })));
}
exports.copy = copy;
