"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const os = require("os");
const util_1 = require("./util");
const { debug } = require("b-logger")("copilot.config");
const yaml = require("js-yaml");
let config = null;
function getAlias() {
    return config.alias;
}
exports.getAlias = getAlias;
function lookupConfigFile() {
    if (fs_1.existsSync(`${util_1.default.path("~/.config/copilot/config.yaml")}`)) {
        return `${util_1.default.path("~/.config/copilot/config.yaml")}`;
    }
    let entryPoint = path_1.parse(process.argv[1]).dir;
    if (fs_1.existsSync(`${entryPoint}/config.yaml`)) {
        return `${entryPoint}/config.yaml`;
    }
    if (fs_1.existsSync(`${__dirname}/../config.yaml`)) {
        return `${__dirname}/../config.yaml`;
    }
    throw new Error("No config.yaml found");
}
function loadConfig() {
    if (!config) {
        config = yaml.safeLoad(fs_1.readFileSync(lookupConfigFile()));
        debug("Currenct config:", config);
    }
}
exports.loadConfig = loadConfig;
function getUsing() {
    return Array.from(config.using || []);
}
exports.getUsing = getUsing;
function getConfig(key) {
    if (`${key}[${os.platform()}]` in config.processors) {
        return config.processors[`${key}[${os.platform()}]`];
    }
    else if (key in config.processors) {
        return config.processors[key];
    }
    else {
        debug("No config for ", key);
    }
    return {};
}
exports.getConfig = getConfig;
