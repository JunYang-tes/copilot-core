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
const config_1 = require("./config");
const action_1 = require("./action");
const { debug, warn, error } = require("b-logger")("copilot.main");
const { asyncify } = require("array-asyncify");
let processors = null;
let processorNames;
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
    let alias = Object.keys(config_1.getAlias())
        .filter(a => a.startsWith(cmd))
        .map(alia => ({
        title: alia,
        text: "Alia hint",
        value: alia
    }));
    return alias.concat(processorNames.filter(name => {
        return names.some(i => name.toLowerCase().startsWith(i));
    })
        .map(name => ({
        title: name,
        text: name,
        value: name,
        param: {
            action: "complete",
            processor: processors[name]
        }
    })));
}
function handle(input) {
    return __awaiter(this, void 0, void 0, function* () {
        let ret = [];
        if (processors === null) {
            throw new Error("processors is empty,call startUp before handle");
        }
        let cmds = cmd_1.parse(input);
        return asyncify(cmds)
            .reduce((pre, next, idx) => __awaiter(this, void 0, void 0, function* () {
            debug("Process: ", next);
            let p = lookup(next.cmd);
            if (p) {
                ret = yield p(next.args || {}, ret);
                return ret;
            }
            else if (idx === cmds.length - 1) {
                debug("Complete-");
                return complete(next.cmd);
            }
            else {
                debug(`No such processor:`, next.cmd);
                throw {
                    type: "command-not-found",
                    cmd: next.cmd
                };
            }
        }), {});
    });
}
exports.handle = handle;
