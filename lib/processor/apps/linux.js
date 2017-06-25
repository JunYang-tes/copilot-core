"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../../util");
const util_2 = require("../../util");
const x11_desktop_entry_1 = require("./x11-desktop-entry");
const { debug, warn } = require("b-logger")("apps");
const { asyncify } = require("array-asyncify");
exports.default = {
    async init(cfg) {
        debug("Init apps:", cfg);
        this.path = cfg.path;
        this.launch = cfg.launch;
        let icons = {};
        let app = /\.desktop$/;
        this.entires = [];
        let iconReg = new RegExp(cfg.icon, "i");
        await Promise.all(cfg.icons.map(async (p) => {
            (await util_2.readdir(util_1.default.path(p)))
                .filter((f) => iconReg.test(f))
                .reduce((ret, next) => {
                ret[next.replace(/\..*$/, "")] = `${util_1.default.path(p)}/${next}`;
                return ret;
            }, icons);
        }));
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
        await Promise.all(this.path.map(async (p) => {
            p = util_1.default.path(p);
            let entires = (await util_2.readdir(p))
                .filter(name => app.test(name));
            entires = await asyncify(entires)
                .map(async (entryFile) => {
                try {
                    let entry = await x11_desktop_entry_1.parse(`${p}/${entryFile}`);
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
            })
                .filter(i => i);
            debug(`Loaded entries:${entires.length}`);
            this.entires.push(...entires);
        }));
    },
    list() {
        return this.entires;
    },
    launch(op, list) {
        let uri = op.uri || "";
        return list.map(i => ({
            title: i.title,
            text: `Run ${i.text}`,
            value: i.value,
            param: {
                action: "cmd",
                cmd: this.launch,
                args: [i.param.entryName, uri]
            }
        }));
    }
};
