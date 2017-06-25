"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const os = require("os");
const { debug } = require("b-logger")("copilot.config");
const yaml = require("js-yaml");
let config = null;
function getAlias() {
    return config.alias;
}
exports.getAlias = getAlias;
function loadConfig() {
    if (!config) {
        config = yaml.safeLoad(fs_1.readFileSync(`${__dirname}/../config.yaml`));
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
