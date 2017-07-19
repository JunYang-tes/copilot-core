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
const LRU = require("lru-cache");
class Cache {
    constructor({ loader, size }) {
        this.cache = LRU({
            max: size
        });
        this.loader = loader;
    }
    get(key) {
        return __awaiter(this, void 0, void 0, function* () {
            let value = this.cache.get(key);
            if (value === null || value === undefined) {
                value = yield this.loader.load(key);
                if (value != null && value !== undefined) {
                    this.cache.set(key, value);
                }
            }
            return value;
        });
    }
    set(key, value) {
        this.cache.set(key, value);
    }
}
exports.Cache = Cache;
