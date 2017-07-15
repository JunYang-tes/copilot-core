"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cmd = require("./cmd");
const run_complete_1 = require("./run-complete");
const run_timeout_1 = require("./run-timeout");
const copy_1 = require("./copy");
const actions = {
    cmd: cmd.cmd,
    complete: run_complete_1.complete,
    timeout: run_timeout_1.timeout,
    copy: copy_1.copy,
};
exports.default = actions;
