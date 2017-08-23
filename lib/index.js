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
const external_1 = require("./external");
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
process.on("uncaughtException", (e) => {
    error("UncaughtException:");
    error(e);
});
function startUp() {
    return __awaiter(this, void 0, void 0, function* () {
        debug("@startUp");
        let loaded = yield index_1.load({});
        processors = loaded.processors;
        let exProcessors = yield external_1.load();
        for (let p of exProcessors) {
            Object.assign(processors, p.processors);
        }
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
    return __awaiter(this, void 0, void 0, function* () {
        if (result.param && ("action" in result.param)) {
            debug("run:", result.param);
            yield action_1.default[result.param.action](result.param, result);
        }
        else {
            debug("Unknow what to run,fallback to copy");
            yield action_1.default.copy(null, result);
        }
        cache.clear();
    });
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
    return {
        fullname,
        processor: processors[fullname]
    };
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
            text: name,
            icon: name
        };
        return Object.assign({}, info, { param: {
                action: "complete",
                processor: processors[name]
            } });
    }));
}
function lookUpIcon(cmd) {
    let aliasInfo = config_1.getAliasInfo();
    if (aliasInfo[cmd] && aliasInfo[cmd].icon) {
        return aliasInfo[cmd].icon;
    }
    let processorInfo = config_1.getProcessorsInfo();
    let using = config_1.getUsing();
    let fullname = cmd;
    while (!(fullname in processorInfo) && using.length) {
        fullname = `${using.pop()}.${cmd}`;
    }
    if (processorInfo[fullname] && processorInfo[fullname].icon) {
        return processorInfo[fullname].icon;
    }
    return fullname in processorInfo ? fullname : cmd;
}
function fixIResult(list) {
    return list.map(i => {
        if (!("value" in i)) {
        }
    });
}
function handle(input) {
    return __awaiter(this, void 0, void 0, function* () {
        let ret = [];
        if (processors === null) {
            throw new Error("processors is empty,call startUp before handle");
        }
        let cmdInfo = cmd_1.parse(input);
        let cmds = cmdInfo.parsed;
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
            let { processor, fullname } = lookup(next.cmd);
            debug(`==${next.cmd}==`);
            debug(`==${next.original}==`);
            if (!processor &&
                (idx !== cmds.length - 1 || next.original.length > next.originalCmd.length)) {
                let completed = complete(next.originalCmd);
                debug(completed[0]);
                completed.length > 0 && (processor = completed[0].param.processor);
            }
            if (processor) {
                next.args._original = next.original;
                ret = (yield processor(next.args || {}, pre))
                    .map(item => (Object.assign({}, item, { icon: item.icon || fullname })));
                if (idx === cmds.length - 1 && !cmdInfo.original.lastCmdHasOpt) {
                    debug("last");
                    debug("complete ", next.originalCmd);
                    debug(complete(cmdInfo.original.lastCmd));
                    ret = ret.concat(complete(cmdInfo.original.lastCmd));
                }
                cache.set(next.cmd, { cmd: next.original, result: ret });
                return ret;
            }
            else {
                debug("Complete-");
                return complete(cmdInfo.original.lastCmd);
            }
        }), [])
            .map(item => (Object.assign({}, item, { icon: iconHelper.fixIcon(item.icon) })));
    });
}
exports.handle = handle;
