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
const fs = require("fs");
const OS = require("os");
const util_1 = require("../util");
const path_1 = require("path");
const { debug } = require("b-logger")("processor.file");
const openCmd = "xdg-open";
exports.default = {
    path: OS.homedir(),
    check() {
        return __awaiter(this, void 0, void 0, function* () {
            debug("Check xdg-open");
            try {
                util_1.utils.exec("which", openCmd);
                return {
                    valid: true
                };
            }
            catch (e) {
                return {
                    valid: false,
                    msg: `No ${openCmd} found, file processors not available`
                };
            }
        });
    },
    cd(op) {
        let [path] = op.strings;
        if (!path.startsWith("/")) {
            path = path_1.resolve(`${this.path}/${path}`);
        }
        if (fs.existsSync(path)) {
            this.path = path;
        }
    },
    open(op, list) {
        return list.map(item => ({
            title: item.title,
            value: item.text,
            text: `Open ${item.text}`,
            param: {
                action: "cmd",
                cmd: "xdg-open",
                args: [item.value]
            }
        }));
    },
    ls(op) {
        return __awaiter(this, void 0, void 0, function* () {
            let [path] = op.strings;
            if (!path)
                path = this.path;
            const files = yield util_1.readdir(path);
            return files.map((file) => {
                const p = path_1.parse(file);
                return {
                    text: file,
                    title: p.name,
                    value: `file:///${file}`,
                };
            });
        });
    },
};
