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
const util_1 = require("../../util");
const ini = require("ini");
function parse(path) {
    return __awaiter(this, void 0, void 0, function* () {
        let content = yield util_1.readFile(path, "utf-8");
        let entry = (ini.parse(content));
        return {
            name: entry["Desktop Entry"].Name,
            icon: entry["Desktop Entry"].Icon || ""
        };
    });
}
exports.parse = parse;
