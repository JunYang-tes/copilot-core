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
exports.default = {
    check() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield util_1.default.exec("which", "wmctrl");
                yield util_1.default.exec("which", "xdotool");
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
        });
    },
    list() {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield util_1.default.exec("wmctrl", "-lp");
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
        });
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
