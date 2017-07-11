"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const os = require("os");
const util_1 = require("./util");
const merge = require("deepmerge");
const { debug } = require("b-logger")("copilot.config");
const yaml = require("js-yaml");
let config = null;
function getAlias() {
    return config.alias;
}
exports.getAlias = getAlias;
function lookupConfigFile(name = "config.yaml") {
    let entryPoint = path_1.parse(process.argv[1]).dir;
    let paths = [
        util_1.default.path(`~/.config/copilot/${name}`),
        `${entryPoint}/${name}`,
        `${__dirname}/../${name}`
    ];
    for (let p of paths) {
        if (fs_1.existsSync(p)) {
            return p;
        }
    }
    throw new Error("No config.yaml found");
}
function infoFix(keys, info, name = (key) => key) {
    let alias = config.alias;
    for (let alia of keys) {
        if (alia in info) {
            if (!info[alia].title) {
                info[alia].title = alia;
            }
            if (!info[alia].text && !info[alia].value) {
                info[alia].text = info[alia].value = name(alia);
            }
            else if (!info[alia].value) {
                info[alia].value = info[alia].text;
            }
            else if (!info[alia].text) {
                info[alia].text = info[alia].value;
            }
        }
        else {
            info[alia] = {
                title: alia,
                text: name(alia),
                value: name(alia)
            };
        }
    }
}
function aliasInfoFix() {
    let info = config.aliasInfo;
    let alias = config.alias;
    for (let alia of Object.keys(alias)) {
        if (alia in info) {
            if (!info[alia].title) {
                info[alia].title = alia;
            }
            if (!info[alia].text && !info[alia].value) {
                info[alia].text = info[alia].value = "Alias hint";
            }
            else if (!info[alia].value) {
                info[alia].value = info[alia].text;
            }
            else if (!info[alia].text) {
                info[alia].text = info[alia].value;
            }
        }
        else {
            info[alia] = {
                title: alia,
                text: "Alias hint",
                value: "Alias hint",
            };
        }
    }
}
function processInfoFix() {
    infoFix(Object.keys(config.processorsInfo), config.processorsInfo);
}
function loadConfig() {
    if (!config) {
        config = yaml.safeLoad(fs_1.readFileSync(lookupConfigFile()));
        try {
            let custom = yaml.safeLoad(fs_1.readFileSync(lookupConfigFile("config.custom.yaml")));
            config = merge(config, custom);
        }
        catch (e) {
            debug("Failed to load custom config", e);
        }
        debug("Currenct config:", config);
        aliasInfoFix();
        processInfoFix();
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
function getAliasInfo() {
    return config.aliasInfo;
}
exports.getAliasInfo = getAliasInfo;
function getProcessorsInfo() {
    return config.processorsInfo;
}
exports.getProcessorsInfo = getProcessorsInfo;
