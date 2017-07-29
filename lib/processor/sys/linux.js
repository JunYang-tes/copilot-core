"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../../util");
const { debug } = require("b-logger")("copilot.sys.linux");
function cmdsRequired(cmds, fn) {
    let canUse = true;
    (() => __awaiter(this, void 0, void 0, function* () {
        try {
            yield Promise.all(cmds.map(cmd => util_1.utils.exec("which", cmd)));
        }
        catch (e) {
            canUse = false;
            debug(e);
        }
    }))();
    return (...args) => {
        if (canUse) {
            return fn(...args);
        }
        else {
            return [{
                    text: "xxx is required"
                }];
        }
    };
}
function init(cfg) {
}
exports.init = init;
function suspend() {
    return [{
            title: "Supend",
            text: "Suspend system",
            value: "Suspend system",
            param: {
                action: "cmd",
                cmd: "systemctl",
                args: ["suspend"]
            }
        }];
}
exports.suspend = suspend;
function reboot() {
    return [{
            title: "Reboot",
            text: "Reboot system",
            value: "Reboot system",
            param: {
                action: "cmd",
                cmd: "systemctrl",
                args: ["reboot"]
            }
        }];
}
exports.reboot = reboot;
function xkill() {
    return [{
            title: "Kill",
            param: {
                action: "cmd",
                cmd: "xkill"
            }
        }];
}
exports.xkill = xkill;
function mute() {
    return [{
            title: "Mute",
            text: "Close audio output"
        }];
}
exports.mute = mute;
exports.wifi = cmdsRequired(["pkexec1", "iw", "ip", "awk", "sh"], function wifi(opt) {
    return __awaiter(this, void 0, void 0, function* () {
        let ifs = (yield util_1.utils.exec("sh", ["-c", "iw dev | grep Interface | awk '{print $2}'"]))
            .split("\n")
            .filter(i => i);
        let status = (yield util_1.utils.exec("sh", ["-c", " ip link show | grep '^[0-9]'"]))
            .split("\n")
            .map(line => line.split(/\s+/))
            .filter(a => a.length >= 3)
            .map(([id, name, statusStr]) => {
            return {
                name: name.substring(0, name.length - 1),
                up: statusStr.includes("UP")
            };
        })
            .reduce((i, ret) => (i[ret.name] = ret, i), {});
        debug("", ifs, status);
        return ifs.map(i => ({
            text: `Turn  ${i} ${status[i].up ? "down" : "up"}`,
            param: {
                action: "cmd",
                cmd: "pkexec",
                args: ["ip", "link", "set", i, status[i].up ? "down" : "up"]
            }
        }));
    });
});
exports.ip = cmdsRequired(["ifconfig", "awk", "sh"], function ip() {
    return __awaiter(this, void 0, void 0, function* () {
        let ifs = (yield util_1.utils.exec("ifconfig", ["-s"]))
            .split("\n")
            .slice(1)
            .map(line => line.split(/\s+/))
            .map(([name, mtu, met, RXOK, RXERRR]) => ({ name, RXOK: +RXOK }))
            .filter(i => i.name)
            .sort((a, b) => b.RXOK - a.RXOK);
        for (let i of ifs) {
            try {
                i.ip = (yield util_1.utils.exec("ifconfig", [i.name]))
                    .split("\n")
                    .filter(line => /inet addr/.test(line))
                    .map(line => /\d*\.\d*\.\d*\.\d*/.exec(line))
                    .filter(item => item)
                    .map(line => (debug(line), line))
                    .map(item => item[0])[0];
            }
            catch (e) {
                debug(e);
            }
        }
        return ifs
            .filter(i => i.ip)
            .map(i => ({
            title: i.name,
            text: i.ip
        }));
    });
});
