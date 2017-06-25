"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const desktopEntry = require("desktop-entry/lib/desktop-entry");
const util_1 = require("../../util");
const ini = require("ini");
async function parse(path) {
    let content = await util_1.readFile(path, "utf-8");
    let entry = (ini.parse(content));
    return {
        name: entry["Desktop Entry"].Name,
        icon: entry["Desktop Entry"].Icon
    };
}
exports.parse = parse;
