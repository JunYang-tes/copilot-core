"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
const { debug } = require("b-logger")("copilot.prepare");
function split(cmd) {
    return cmd.trim().split("|")
        .map(e => {
        e = e.trim();
        let space = e.indexOf(" ");
        if (space > 0) {
            return {
                cmd: e.substring(0, space),
                rest: e.substring(space)
            };
        }
        return {
            cmd: e,
            rest: ""
        };
    });
}
function prepare(cmd) {
    let alias = config_1.getAlias();
    let flag = true;
    let ret = split(cmd);
    while (flag) {
        flag = false;
        debug("before apply:", ret);
        for (let e of ret) {
            if (e.cmd in alias) {
                e.cmd = alias[e.cmd];
                let args = speicalSplit(e.rest.trim());
                e.cmd = e.cmd.replace(/__arg[0-9]+__/g, (m) => {
                    if (args.length) {
                        return args.shift();
                    }
                    return m;
                });
                if (e.cmd.includes("__arg__")) {
                    e.cmd = e.cmd.replace(/__arg__/g, args.join(" "));
                    e.rest = "";
                }
                flag = true;
            }
        }
        debug("alias applied:", ret);
        if (flag) {
            cmd = ret.reduce((ret, next) => (ret += next.cmd + " " + next.rest + " |", ret), "");
            ret = split(cmd.substr(0, cmd.length - 1));
        }
    }
    debug(`Convert ${cmd} to \n`, ret);
    return ret;
}
exports.prepare = prepare;
function speicalSplit(str, by = /\s/) {
    let parts = [];
    let currentPart = "";
    let inStr = 1;
    let inSingleQuotedStr = 2;
    let state = 0;
    let init = 0;
    for (let i = 0; i < str.length; i++) {
        let char = str.charAt(i);
        switch (state) {
            case inStr:
                if (char === '"') {
                    state = init;
                }
                currentPart += char;
                break;
            case inSingleQuotedStr:
                if (char === "'") {
                    state = init;
                }
                currentPart += char;
                break;
            case init:
                if (char === '"') {
                    state = inStr;
                }
                else if (char === "'") {
                    state = inSingleQuotedStr;
                }
                else if (by.test(char)) {
                    parts.push(currentPart);
                    currentPart = "";
                    continue;
                }
                currentPart += char;
        }
    }
    if (currentPart) {
        parts.push(currentPart);
    }
    return parts;
}
