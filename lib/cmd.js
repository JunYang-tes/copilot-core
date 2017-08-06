"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parser_1 = require("cli-argparser/lib/parser");
const prepare_1 = require("./prepare");
const { debug } = require("b-logger")("copilot.cmd");
const parser = new parser_1.GuessParser();
function parse(cmd) {
    let splited = prepare_1.split(cmd);
    let lastCmd = splited[splited.length - 1];
    return {
        parsed: prepare_1.prepare(cmd)
            .map(ele => {
            let args;
            if (ele.rest.trim().length) {
                debug("Parse ", ele.rest);
                args = parser.parse(ele.rest.trim());
            }
            else {
                args = {
                    strings: []
                };
            }
            return {
                cmd: ele.cmd.trim(),
                originalCmd: ele.cmd.trim(),
                original: `${ele.cmd} ${ele.rest}`.trim(),
                args
            };
        }),
        original: {
            lastCmd: lastCmd.cmd,
            lastCmdHasOpt: lastCmd.rest.trim().length > 0
        }
    };
}
exports.parse = parse;
