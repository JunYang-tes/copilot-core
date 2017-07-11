"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Cache {
    constructor() {
        this.cache = {};
    }
    get(key) {
        return this.cache[key];
    }
    set(key, value) {
        return this.cache[key] = value;
    }
    clear() {
        this.cache = {};
    }
}
exports.Cache = Cache;
