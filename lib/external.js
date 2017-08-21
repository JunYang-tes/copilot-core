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
const index_1 = require("./processor/index");
const ProcessorName_1 = require("./util/ProcessorName");
const config_1 = require("./config");
const util_1 = require("./util");
const util_2 = require("./util");
const { debug, warn } = require("b-logger")("copilot.external");
const { asyncify } = require("array-asyncify");
const { parse } = require("path");
function loadJsProcessor(path) {
    return __awaiter(this, void 0, void 0, function* () {
        debug("Load external js processor from ");
        debug(path);
        debug(asyncify);
        return yield asyncify(path)
            .map((p) => __awaiter(this, void 0, void 0, function* () {
            p = util_1.default.path(p);
            try {
                let dirs = yield util_2.readdir(p);
                return asyncify(dirs)
                    .filter((file) => __awaiter(this, void 0, void 0, function* () { return (yield util_2.stat(`${p}/${file}`)).isDirectory(); }))
                    .map(f => `${p}/${f}`);
            }
            catch (e) {
                warn(e);
            }
            return [];
        }))
            .reduce((ret, next) => (ret.push(...next), ret), [])
            .map((p) => __awaiter(this, void 0, void 0, function* () {
            try {
                debug("load external js processor from ", p);
                let { name } = parse(p);
                return yield index_1.load({
                    dir: p,
                    name: ProcessorName_1.prefix(`js.${name}`)
                });
            }
            catch (e) {
                warn(e);
            }
        }))
            .filter((i) => i);
    });
}
function load() {
    return loadJsProcessor(config_1.getConfigByKeys("external.processor", "js", "path") || []);
}
exports.load = load;
