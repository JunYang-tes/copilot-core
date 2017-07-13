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
const tldr = require("tldr/lib/index");
const platform = require("tldr/lib/platform");
const cache = require("tldr/lib/cache");
const { debug } = require("b-logger")("copilor.processors.tldr");
const commandsFor = (os) => new Promise((res, rej) => {
    tldr.commandsFor(os, res);
});
const getPage = (cmd) => new Promise((res, rej) => {
    cache.getPage(cmd, (err, content) => {
        if (err) {
            rej(err);
        }
        else {
            res((content || "").split("\n"));
        }
    });
});
exports.default = {
    list() {
        return __awaiter(this, void 0, void 0, function* () {
            let os = platform.getPreferredPlatformFolder();
            let commands = yield commandsFor(os);
            return commands.map(cmd => ({
                text: cmd,
                value: cmd
            }));
        });
    },
    show(op) {
        return __awaiter(this, void 0, void 0, function* () {
            let cmd = op.strings.join();
            if (cmd && cmd.endsWith("$")) {
                cmd = cmd.slice(0, -1);
                try {
                    let content = (yield getPage(cmd)).filter(i => i.trim().length);
                    let text = "";
                    let item = {
                        title: "",
                        text: ""
                    };
                    let ret = [];
                    for (let line of content) {
                        if (line.trim().startsWith("-")) {
                            item.value = item.text;
                            ret.push(item);
                            item = {
                                title: line,
                                text: ""
                            };
                        }
                        else {
                            item.text += line;
                        }
                    }
                    ret.push(item);
                    return ret;
                }
                catch (e) {
                    debug(e);
                    cache.update();
                    return [{
                            title: "tldr",
                            text: "No entry,updating..."
                        }];
                }
            }
            return [{
                    text: "Show short usage ,trigger by $"
                }];
        });
    }
};
