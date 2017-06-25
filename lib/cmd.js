"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parser_1 = require("cli-argparser/lib/parser");
const prepare_1 = require("./prepare");
const { debug } = require("b-logger")("copilot.cmd");
const parser = new parser_1.GuessParser();
function parse(cmd) {
    return prepare_1.prepare(cmd)
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
            cmd: ele.cmd,
            original: `${ele.cmd} ${ele.rest}`,
            args
        };
    });
}
exports.parse = parse;
