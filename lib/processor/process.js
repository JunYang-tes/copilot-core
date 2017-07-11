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
const util_1 = require("../util");
const { debug } = require("b-logger")("processor.process");
function list() {
    return __awaiter(this, void 0, void 0, function* () {
        let ret = yield util_1.utils.exec("ps", "ux");
        return ret.split("\n")
            .map(line => line.split(/\s+/))
            .map(([user, pid, cpu, mem, vsz, rss, tty, stat, start, time, ...command]) => ({
            title: command[0],
            text: command.join(" "),
            value: command.join(" "),
            param: {
                pid,
            }
        }));
    });
}
exports.list = list;
function kill(op, list) {
    let signal = op.strings[0] || "INT";
    return list.map(item => ({
        title: item.title,
        text: `Kill ${item.value} (with ${signal})`,
        value: `Kill ${item.value} (with ${signal})`,
        param: {
            action: "cmd",
            cmd: "kill",
            args: ["-s", signal, item.param.pid]
        }
    }));
}
exports.kill = kill;
