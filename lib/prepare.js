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
                if (e.cmd.includes("__arg__")) {
                    e.cmd = e.cmd.replace("__arg__", e.rest);
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
    debug(`Convert ${cmd} to `, ret);
    return ret;
}
exports.prepare = prepare;
