"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../util");
const { debug, error } = require("b-logger")("copilot.action.cmd");
async function cmd(param) {
    try {
        await util_1.default.exec(param.cmd, param.args);
    }
    catch (e) {
        error(`Failed to execute `, param);
        error(e);
    }
}
exports.cmd = cmd;
