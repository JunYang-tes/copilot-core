"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
const { debug } = require("b-logger")("copilot.prepare");
const util_1 = require("./util");
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
exports.split = split;
function findMatchedAlias(cmd) {
    let alias = config_1.getAlias();
    let names = Object.keys(alias).sort();
    if (cmd in alias) {
        return alias[cmd];
    }
    return names.find((value) => value.startsWith(cmd));
}
function prepare(cmd) {
    let alias = config_1.getAlias();
    let flag = true;
    let ret = split(cmd);
    while (flag) {
        flag = false;
        debug("before apply:", ret);
        for (let e of ret) {
            let name = findMatchedAlias(e.cmd);
            if (name) {
                e.cmd = name;
                let args = util_1.speicalSplit(e.rest.trim());
                e.cmd = e.cmd.replace(/__arg[0-9]+__/g, (m) => {
                    let idx = +m.replace(/[^\d]/g, "") - 1;
                    if (idx < args.length) {
                        let replace = args[idx];
                        args[idx] = 0;
                        return replace;
                    }
                    return m;
                });
                args = args.filter(i => i);
                if (e.cmd.includes("__arg__")) {
                    e.cmd = e.cmd.replace(/__arg__/g, args.join(" "));
                    args = [];
                }
                e.rest = args.join(" ");
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
