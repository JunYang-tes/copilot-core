"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const pathUtil = require("path");
const { debug } = require("b-logger")("copilot.icon");
class IconHelper {
    constructor(path, img = /\.(jpg|png|gif)$/, iconNameRule = /[a-zA-Z0-9]+(\.[a-zA-Z0-9]*)*/) {
        this.iconNameRule = iconNameRule;
        this.icons = {};
        for (let p of path) {
            fs.readdirSync(p)
                .filter(img.test.bind(img))
                .forEach((file) => {
                this.icons[pathUtil.parse(file).name] = pathUtil.join(p, file);
            });
        }
        debug(this.icons);
    }
    fixIcon(icon) {
        icon = icon || "buildin.default";
        if (this.iconNameRule.test(icon)) {
            return this.icons[icon] || this.icons["buildin.default"];
        }
        if (icon.startsWith("/")) {
            return `file:///${icon}`;
        }
        return icon;
    }
}
exports.IconHelper = IconHelper;
