"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../util");
exports.default = {
    async check() {
        try {
            await util_1.default.exec("which", "wmctrl");
            await util_1.default.exec("which", "xdotool");
            return {
                valid: true
            };
        }
        catch (e) {
            return {
                valid: false,
                msg: "No wmctrl found, please install it"
            };
        }
    },
    async list() {
        let ret = await util_1.default.exec("wmctrl", "-lp");
        return ret.split("\n")
            .map(line => line.split(/\s/))
            .map(([id, desktop, pid, machine, ...rest]) => ({
            id, desktop, pid, machine, title: rest.join(" ")
        }))
            .map((param) => ({
            title: param.title,
            text: param.title,
            value: param.title,
            type: "windows",
            param
        }));
    },
    active(op, list) {
        return list.map(item => ({
            title: item.title,
            text: `Active ${item.text}`,
            param: {
                action: "cmd",
                cmd: "xdotool",
                args: ["windowactivate", item.param.id]
            }
        }));
    },
    close(op, list) {
        return list.map(item => ({
            title: item.title,
            text: `Close ${item.text}`,
            param: {
                action: "cmd",
                cmd: "xdotool",
                args: ["windowclose", item.param.id]
            }
        }));
    },
};
