"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const OS = require("os");
const util_1 = require("../util");
const path_1 = require("path");
const openCmd = "xdg-open";
exports.default = {
    path: OS.homedir(),
    async check() {
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
    async ls(op) {
        let [path] = op.strings;
        if (!path)
            path = this.path;
        const files = await util_1.readdir(path);
        return files.map((file) => {
            const p = path_1.parse(file);
            return {
                text: file,
                title: p.name,
                value: `file:///${file}`,
            };
        });
    },
};
