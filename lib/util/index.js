"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const fs = require("fs");
const util = require("util");
const os = require("os");
const helper = {
    path: (str) => {
        return str.replace(/^\s*~/, os.homedir);
    },
    exec: (command, args, options = {}) => new Promise((res, rej) => {
        let arg = util.isArray(args) ? args : [args];
        let cmd = child_process_1.spawn(command, arg, options);
        let errorStr = "";
        let stdout = "";
        cmd.stderr.on("data", (data) => {
            errorStr += data;
        });
        cmd.stdout.on("data", (data) => {
            stdout += data.toString();
        });
        cmd.on("close", (code) => {
            if (code === 0) {
                res(stdout);
            }
            else {
                rej({
                    code,
                    errorStr
                });
            }
        });
    }),
    sh: (command, args) => helper.exec(command, args, { shell: true }),
    promisify: (api) => (...param) => new Promise((res, rej) => {
        api(...param, (err, ...rest) => {
            if (err) {
                rej(err);
            }
            else {
                res(...rest);
            }
        });
    }),
};
exports.stat = helper.promisify(fs.stat);
exports.readdir = helper.promisify(fs.readdir);
exports.readFile = helper.promisify(fs.readFile);
exports.default = helper;
