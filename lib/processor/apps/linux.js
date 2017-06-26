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
const util_2 = require("../../util");
const x11_desktop_entry_1 = require("./x11-desktop-entry");
const { debug, warn } = require("b-logger")("apps");
const { asyncify } = require("array-asyncify");
exports.default = {
    init(cfg) {
        return __awaiter(this, void 0, void 0, function* () {
            debug("Init apps:", cfg);
            this.path = cfg.path;
            this.cfg = cfg;
            let icons = {};
            let app = /\.desktop$/;
            this.entires = [];
            let iconReg = new RegExp(cfg.icon, "i");
            yield Promise.all(cfg.icons.map((p) => __awaiter(this, void 0, void 0, function* () {
                (yield util_2.readdir(util_1.default.path(p)))
                    .filter((f) => iconReg.test(f))
                    .reduce((ret, next) => {
                    ret[next.replace(/\..*$/, "")] = `${util_1.default.path(p)}/${next}`;
                    return ret;
                }, icons);
            })));
            let launder = (entryName) => {
                return (op, list) => {
                    return [{
                            title: entryName,
                            value: `Open ${op.strings.join(" ")} with ${entryName}`,
                            text: `Open ${op.strings.join(" ")} with ${entryName}`,
                            param: {
                                action: "cmd",
                                cmd: cfg.launch,
                                args: [entryName, ...op.strings]
                            }
                        }];
                };
            };
            yield Promise.all(this.path.map((p) => __awaiter(this, void 0, void 0, function* () {
                p = util_1.default.path(p);
                let entires = (yield util_2.readdir(p))
                    .filter(name => app.test(name));
                entires = yield asyncify(entires)
                    .map((entryFile) => __awaiter(this, void 0, void 0, function* () {
                    try {
                        let entry = yield x11_desktop_entry_1.parse(`${p}/${entryFile}`);
                        let result = {
                            title: entry.name,
                            text: entry.name,
                            icon: icons[entry.icon],
                            value: entry.name,
                            param: {
                                entryName: entryFile,
                                path: `${p}/${entryFile}`
                            }
                        };
                        let name = entry.name.replace(/\s.*/, "");
                        if (name in this) {
                            name = entry.name.replace(/\s/g, "");
                        }
                        let i = 1;
                        let tmp = name;
                        while (tmp in this) {
                            tmp = name + i;
                            i++;
                        }
                        name = tmp;
                        this[name] = launder(entryFile);
                        debug(`Create launcher:`, entry.name, `${p}/${entryFile}`);
                        return result;
                    }
                    catch (e) {
                        warn(`Failed to parse ${p}/${entryFile}`, e);
                    }
                }))
                    .filter(i => i);
                debug(`Loaded entries:${entires.length}`);
                this.entires.push(...entires);
            })));
        });
    },
    list() {
        return this.entires;
    },
    launch(op, list) {
        let uri = op.uri || "";
        return list.map(i => (Object.assign({}, i, { text: `Run ${i.text}`, param: {
                action: "cmd",
                cmd: this.cfg.launch,
                args: uri.length ? [i.param.entryName, uri] : [i.param.entryName]
            } })));
    }
};
