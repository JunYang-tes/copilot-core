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
const util_1 = require("../util");
const { debug, error } = require("b-logger")("copilot.action.cmd");
function cmd(param) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield util_1.default.exec(param.cmd, param.args);
        }
        catch (e) {
            error(`Failed to execute `, param);
            error(e);
        }
    });
}
exports.cmd = cmd;
