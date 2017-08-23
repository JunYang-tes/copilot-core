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
const child_process_1 = require("child_process");
const util_1 = require("./util");
const util_2 = require("./util");
const { debug, warn } = require("b-logger")("copilot.external");
const { asyncify } = require("array-asyncify");
const { parse, sep: PATH_SEP, join: pathJoin } = require("path");
const yaml = require("js-yaml");
function loadFromPathArray(path, load) {
    return __awaiter(this, void 0, void 0, function* () {
        debug("Load external processor from ");
        debug(path);
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
                debug("load external  processor from ", p);
                return yield load(p);
            }
            catch (e) {
                warn(e);
            }
        }))
            .filter((i) => i);
    });
}
function loadJsProcessor(path) {
    return __awaiter(this, void 0, void 0, function* () {
        debug("Load external js processor from ");
        debug(path);
        return loadFromPathArray(path, (p) => {
            let { name } = parse(p);
            return index_1.load({
                dir: p,
                name: ProcessorName_1.prefix(`js.${name}`)
            });
        });
    });
}
function wrapper(filePath) {
    return (op, list) => {
        debug(util_2.speicalSplit(op._original));
        let cp = child_process_1.spawn(filePath, util_2.speicalSplit(op._original).slice(1));
        if (list) {
            cp.stdin.write(yaml.dump(list));
        }
        let out = "";
        let resolver;
        let rejector;
        let promsie = new Promise((res, rej) => {
            resolver = res;
            rejector = rej;
        });
        cp.stdout.setEncoding("utf8");
        cp.stdout.on("data", d => out += d);
        cp.on("close", (code) => {
            try {
                if (code === 0) {
                    resolver(yaml.safeLoad(out));
                }
                else {
                    rejector(new Error("Child process return non-zero"));
                }
            }
            catch (e) {
                rejector(e);
            }
        });
        return promsie;
    };
}
function loadScript(path, processorName) {
    return __awaiter(this, void 0, void 0, function* () {
        return asyncify(yield util_2.readdir(path))
            .filter((file) => __awaiter(this, void 0, void 0, function* () {
            try {
                return (yield util_2.stat(pathJoin(path, file))).isFile();
            }
            catch (e) {
                warn(e);
                return false;
            }
        }))
            .map(file => {
            debug("load script:", file);
            let { dir, name } = parse(pathJoin(path, file));
            debug(pathJoin(path, file));
            debug(dir, name);
            let idx = dir.lastIndexOf(PATH_SEP);
            return {
                filePath: pathJoin(path, file),
                fileName: dir.slice(idx + 1),
                processorName: name
            };
        })
            .reduce((ret, next) => (ret.processors[processorName(next.fileName, next.processorName)]
            = wrapper(next.filePath), ret), { processors: {} });
    });
}
function loadScriptProcessor(path) {
    return __awaiter(this, void 0, void 0, function* () {
        debug("Load external script processors from ");
        debug(path);
        let name = ProcessorName_1.prefix("spt");
        return loadFromPathArray(path, (dir) => loadScript(dir, name));
    });
}
function load() {
    return __awaiter(this, void 0, void 0, function* () {
        return (yield loadJsProcessor(config_1.getConfigByKeys("external.processor", "js", "path") || []))
            .concat(yield loadScriptProcessor(config_1.getConfigByKeys("external.processor", "script", "path") || []));
    });
}
exports.load = load;
