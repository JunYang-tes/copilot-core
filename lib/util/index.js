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
    })
};
exports.stat = helper.promisify(fs.stat);
exports.readdir = helper.promisify(fs.readdir);
exports.readFile = helper.promisify(fs.readFile);
exports.default = helper;
exports.utils = helper;
function cmdsRequired(cmds, fn, errors = []) {
    let error = "";
    let canUse = true;
    (() => __awaiter(this, void 0, void 0, function* () {
        try {
            yield Promise.all(cmds.map((cmd, idx) => __awaiter(this, void 0, void 0, function* () {
                try {
                    yield exports.utils.exec("which", cmd);
                }
                catch (e) {
                    error = errors[idx] || `${cmd} is missing,please to install it`;
                    throw e;
                }
            })));
        }
        catch (e) {
            canUse = false;
        }
    }))();
    return function cmdsReqWrapper(...args) {
        if (canUse) {
            return fn.apply(this, args);
        }
        else {
            return [{
                    text: error,
                    value: error
                }];
        }
    };
}
exports.cmdsRequired = cmdsRequired;
