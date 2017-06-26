"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cmd = require("./cmd");
const run_complete_1 = require("./run-complete");
const actions = {
    cmd: cmd.cmd,
    complete: run_complete_1.complete
};
exports.default = actions;
