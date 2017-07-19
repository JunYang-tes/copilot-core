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
const { debug, error } = require("b-logger")("copilot.dict");
class Dict {
    constructor({ loader }) {
        this.loader = loader;
    }
    declare() {
        return {
            services: ["cache"],
            params: {
                cache: {
                    loader: this.loader,
                    size: 100
                }
            }
        };
    }
    init({ cfg, services }) {
        this.store = services.store;
        this.cache = services.cache;
        this.cfg = cfg;
        debug("My services:", services);
        debug("My cfg", cfg);
    }
    lookup(op) {
        return __awaiter(this, void 0, void 0, function* () {
            let word = op.strings.join(" ").trim();
            if (this.cfg.trigger && !word.endsWith(this.cfg.trigger)) {
                return [{
                        text: `Look up ${word},trigger by ${this.cfg.trigger}`
                    }];
            }
            if (this.cfg.trigger) {
                word = word.replace(this.cfg.trigger, "");
            }
            debug("lookup ", word);
            try {
                return (yield this.cache.get(word)) || [{ title: "No result" }];
            }
            catch (e) {
                debug(e);
                return [{
                        title: "Failed to lookup "
                    }];
            }
        });
    }
}
exports.Dict = Dict;
