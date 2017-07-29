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
const config_1 = require("../config");
const fs_1 = require("fs");
const path_1 = require("path");
const { debug, error } = require("b-logger")("copilot.services.store");
const sqlite3 = require("sqlite3").verbose();
const mkdirp = require("mkdirp");
let dbfile = ":memory:";
try {
    dbfile = util_1.utils.path(config_1.getServices().store.file);
    debug("Using ", dbfile);
    if (!fs_1.existsSync(dbfile)) {
        mkdirp.sync(path_1.parse(dbfile).dir);
    }
}
catch (e) {
    dbfile = ":memory:";
    error("Failed to set db file", e);
}
const db = new sqlite3.Database(dbfile);
const get = util_1.utils.promisify(db.get.bind(db));
const run = (sql, ...param) => new Promise((res, rej) => {
    db.run(sql, ...param, function cb(err) {
        if (err) {
            rej(err);
        }
        else {
            res(this);
        }
    });
});
let inilizedResolver;
let inilizedReject;
let inilizedPromise = new Promise((res, rej) => { inilizedResolver = res, inilizedReject = rej; });
function initializeDb() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((res, rej) => {
            db.serialize(() => __awaiter(this, void 0, void 0, function* () {
                try {
                    let queryTables = "SELECT count(0) as number FROM sqlite_master WHERE type='table' AND name='store'";
                    let ret = yield get(queryTables);
                    debug("Ret", ret);
                    if (ret.number === 0) {
                        yield run(`CREATE TABLE store(
            namespace text,
            key text,
            value text
          )`);
                        yield run(`INSERT INTO store values("test","key","value")`);
                    }
                    debug(yield get(queryTables));
                    inilizedResolver();
                    res();
                }
                catch (e) {
                    rej(e);
                    inilizedReject(e);
                }
            }));
        });
    });
}
initializeDb()
    .then(() => {
    debug("Db initialized");
})
    .catch((e) => error("Error", e));
class Store {
    constructor({ namespace }) {
        this.namespace = namespace;
    }
    get(key) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.wait4init();
            let ret = yield get(`select value from store where namespace = ? and key = ?`, this.namespace, key);
            debug(ret);
            if (ret) {
                return ret.value;
            }
            return null;
        });
    }
    set(key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.wait4init();
            try {
                let ret = yield run("UPDATE store SET value=? WHERE namespace = ? and key = ? ", value, this.namespace, key);
                debug("Update ", ret);
                if (!ret.changes) {
                    run("INSERT INTO store values(?,?,?)", this.namespace, key, value);
                }
            }
            catch (e) {
                debug(e);
                throw new Error("ESQL");
            }
        });
    }
    getJson(key) {
        return __awaiter(this, void 0, void 0, function* () {
            return JSON.parse(yield this.get(key));
        });
    }
    setJson(key, json) {
        return __awaiter(this, void 0, void 0, function* () {
            this.set(key, JSON.stringify(json));
        });
    }
    wait4init() {
        return inilizedPromise;
    }
}
exports.Store = Store;
