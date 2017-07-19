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
const fs = require("fs");
const util_1 = require("../util");
const util_2 = require("../util");
const util = require("util");
const path = require("path");
const config_1 = require("../config");
const services_1 = require("../services");
const { asyncify } = require("array-asyncify");
const { debug, warn, error } = require("b-logger")("processor.loader");
const readdir = util_1.default.promisify(fs.readdir);
function isCheckResultArray(x) {
    return x instanceof Array;
}
function validProcessorName(name) {
    let specialName = ["check", "init", "declare"];
    return !specialName.includes(name) && !/_$/.test(name);
}
function parse(obj, fileName, name) {
    return __awaiter(this, void 0, void 0, function* () {
        const processors = {};
        let param = {
            cfg: config_1.getConfig(name({ fileName, funName: "" }).replace(/\.$/, "")),
            services: {}
        };
        if (obj.declare && util.isFunction(obj.declare)) {
            let declare = obj.declare();
            declare.params = declare.params || {};
            debug("declared dependencies:", declare);
            if (declare.services) {
                param.services = declare.services
                    .map(serviceName => {
                    let serviceParam = declare.params[serviceName] || {};
                    return {
                        key: serviceName,
                        value: services_1.getServices(serviceName, Object.assign({}, serviceParam, { namespace: name({ fileName, funName: "" }) }))
                    };
                })
                    .reduce((ret, next) => (ret[next.key] = next.value, ret), {});
            }
        }
        if (obj.init && util.isFunction(obj.init)) {
            yield obj.init(param);
        }
        if (obj.check && util.isFunction(obj.check)) {
            const check = obj.check;
            const checkResult = yield check();
            if (checkResult) {
                if (isCheckResultArray(checkResult)) {
                    const invalid = checkResult;
                    Object.keys(obj)
                        .filter((key) => validProcessorName(key) && invalid.every(e => e.key !== key))
                        .map(key => obj[key].bind(obj))
                        .forEach(fun => {
                        processors[name({ funName: fun.name, fileName }).replace(/\.default$/, "")] = fun;
                    });
                    return {
                        processors,
                        errors: invalid.map(e => ({ name: e.key, msg: e.msg })),
                    };
                }
                else {
                    if (checkResult.valid) {
                        Object.keys(obj)
                            .filter(key => validProcessorName(key) && util.isFunction(obj[key]))
                            .map(key => obj[key].bind(obj))
                            .forEach(fun => {
                            debug(`Load processor ${fun.name}`);
                            processors[name({ funName: fun.name, fileName })] = fun;
                        });
                    }
                    else {
                        return {
                            errors: checkResult.msg,
                        };
                    }
                }
            }
        }
        else {
            warn(`check return falsy. ${fileName}`);
            debug(Object.keys(obj));
            Object.keys(obj)
                .map(key => {
                debug(`${key} is function:`, util.isFunction(obj[key]));
                return key;
            })
                .filter(key => validProcessorName(key) && util.isFunction(obj[key]))
                .forEach(key => {
                let fun = obj[key];
                processors[name({ funName: key, fileName }).replace(/\.default$/, "")] = fun.bind(obj);
            });
        }
        return { processors };
    });
}
function load({ dir = __dirname, name = ({ fileName, funName }) => `buildin.${fileName}.${funName.replace("bound ", "")}` }) {
    return __awaiter(this, void 0, void 0, function* () {
        debug(`Load processors from ${dir}`);
        let files = yield readdir(dir);
        let processors = {};
        let errors = {};
        let modules = yield asyncify(files)
            .filter((file) => __awaiter(this, void 0, void 0, function* () {
            debug("filter", file);
            if (/\.js$/.test(file) && file !== "index.js") {
                return true;
            }
            else {
                return (yield util_2.stat(`${dir}/${file}`)).isDirectory();
            }
        }))
            .map((file) => {
            try {
                let ret = {
                    module: require(`${dir}/${file}`),
                    name: path.parse(file).name
                };
                return ret;
            }
            catch (e) {
                error(`Failed to load ${dir}/${file}`, e);
            }
        })
            .filter(i => i);
        debug("Modules:", modules);
        for (const item of modules) {
            let { module, name: fileName } = item;
            debug(`Load ${fileName}`);
            if ("default" in module) {
                const defvalue = module.default;
                if (util.isFunction(defvalue)) {
                    processors[name({ funName: defvalue.name, fileName })] = defvalue;
                    continue;
                }
                else {
                    module = defvalue;
                }
            }
            try {
                const parsed = yield parse(module, fileName, name);
                if (parsed.processors) {
                    Object.assign(processors, parsed.processors);
                }
                if (parsed.errors) {
                    errors[fileName] = parsed.errors;
                }
            }
            catch (e) {
                errors[path.resolve(`${dir}/${fileName}`)] = `Failed to load processor from file ${fileName},${e}`;
            }
        }
        return {
            processors,
            errors,
        };
    });
}
exports.load = load;
