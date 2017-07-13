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
const index_1 = require("./processor/index");
const cmd_1 = require("./cmd");
const icon_1 = require("./icon");
const config_1 = require("./config");
const action_1 = require("./action");
const cache_1 = require("./util/cache");
const { debug, warn, error } = require("b-logger")("copilot.main");
const { asyncify } = require("array-asyncify");
const iconHelper = new icon_1.IconHelper([`${__dirname}/../icon`]);
let processors = null;
let processorNames;
let cache = new cache_1.Cache();
function startUp() {
    return __awaiter(this, void 0, void 0, function* () {
        debug("@startUp");
        try {
            config_1.loadConfig();
        }
        catch (e) {
            error(`Failed to load config:`, e);
        }
        let loaded = yield index_1.load({});
        processors = loaded.processors;
        debug("Processors:", processors);
        Object.keys(loaded.errors)
            .forEach(key => {
            warn(`Failed to load ${key}`, loaded.errors[key]);
        });
        processorNames = Object.keys(processors);
    });
}
exports.startUp = startUp;
function run(result) {
    if (result.param && ("action" in result.param)) {
        debug("run:", result.param);
        action_1.default[result.param.action](result.param);
    }
    else {
        debug("Unknow what to run");
    }
    cache.clear();
}
exports.run = run;
function lookup(name) {
    let using = config_1.getUsing();
    let fullname = name;
    debug(`Locakup ${name}`);
    while (!(fullname in processors) && using.length) {
        fullname = `${using.pop()}.${name}`;
        debug(`next ${fullname}`);
    }
    return processors[fullname];
}
function complete(cmd) {
    let names = config_1.getUsing().map(name => `${name}.${cmd}`.toLowerCase());
    names.push(cmd.toLowerCase());
    let aliasInfo = config_1.getAliasInfo();
    let alias = Object.keys(config_1.getAlias())
        .filter(a => a.startsWith(cmd))
        .map(alia => aliasInfo[alia]);
    let pInfo = config_1.getProcessorsInfo();
    return alias.concat(processorNames.filter(name => {
        return names.some(i => name.toLowerCase().startsWith(i));
    })
        .map(name => {
        let info = pInfo[name] || {
            title: name,
            value: name,
            text: name
        };
        return Object.assign({}, info, { param: {
                action: "complete",
                processor: processors[name]
            } });
    }));
}
function handle(input) {
    return __awaiter(this, void 0, void 0, function* () {
        let ret = [];
        if (processors === null) {
            throw new Error("processors is empty,call startUp before handle");
        }
        let cmds = cmd_1.parse(input);
        let useCache = true;
        return asyncify(cmds)
            .reduce((pre, next, idx) => __awaiter(this, void 0, void 0, function* () {
            debug("Process: ", next);
            let cachedRet = cache.get(next.cmd);
            if (cachedRet && cachedRet.cmd === next.original && useCache) {
                debug("Using cache for ", next.original);
                return cachedRet.result;
            }
            else {
                debug("Dont use cache for ", next.cmd);
                useCache = false;
            }
            let p = lookup(next.cmd);
            if (p) {
                ret = (yield p(next.args || {}, pre))
                    .map(item => (Object.assign({}, item, { icon: item.icon || next.cmd })));
                cache.set(next.cmd, { cmd: next.original, result: ret });
                return ret;
            }
            else {
                debug("Complete-");
                return complete(next.cmd);
            }
        }), [])
            .map(item => (Object.assign({}, item, { icon: iconHelper.fixIcon(item.icon) })));
    });
}
exports.handle = handle;
