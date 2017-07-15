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
const copyPaste = require("clipboardy");
const { debug, error } = require("b-logger")("copilot.action.copy");
function copy(param, item) {
    return __awaiter(this, void 0, void 0, function* () {
        let value = item.value;
        if (param && param.field && param.field in item) {
            value = item[param.field];
        }
        try {
            debug("copy ", value);
            yield copyPaste.write("" + value);
        }
        catch (e) {
            error("Failed to copy ", e);
        }
    });
}
exports.copy = copy;
