"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./processor/index");
const cmd_1 = require("./cmd");
const config_1 = require("./config");
const action_1 = require("./action");
const { debug, warn, error } = require("b-logger")("copilot.main");
const { asyncify } = require("array-asyncify");
let processors = null;
async function startUp() {
    debug("@startUp");
    try {
        config_1.loadConfig();
    }
    catch (e) {
        error(`Failed to load config:`, e);
    }
    let loaded = await index_1.load({});
    processors = loaded.processors;
    debug("Processors:", processors);
    Object.keys(loaded.errors)
        .forEach(key => {
        warn(`Failed to load ${key}`, loaded.errors[key]);
    });
}
exports.startUp = startUp;
function run(result) {
    if (result.param && ("action" in result.param)) {
        debug(action_1.default);
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
async function handle(input) {
    let ret = [];
    if (processors === null) {
        throw new Error("processors is empty,call startUp before handle");
    }
    let cmds = cmd_1.parse(input);
    return asyncify(cmds)
        .reduce(async (pre, next, idx) => {
        debug("Exec: ", next);
        let p = lookup(next.cmd);
        if (p) {
            ret = await p(next.args || {}, ret);
            debug(`Result of ${next.cmd}`, ret);
            return ret;
        }
        else if (idx !== cmds.length - 1) {
            debug(`No such processor:`, next.cmd);
            throw {
                type: "command-not-found",
                cmd: next.cmd
            };
        }
        else {
            return [];
        }
    }, {});
}
exports.handle = handle;
