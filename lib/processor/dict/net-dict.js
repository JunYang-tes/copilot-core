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
const dict_1 = require("./dict");
const querystring = require("querystring");
const fetch = require("node-fetch");
const { debug } = require("b-logger")("copilot.net-dict");
class NetDict extends dict_1.Dict {
    constructor({ format, responseHandler, }) {
        super({
            loader: {
                load: (word) => __awaiter(this, void 0, void 0, function* () {
                    let fromStore = null;
                    try {
                        fromStore = yield this.store.getJson(word);
                        if (fromStore) {
                            fromStore = format(fromStore);
                        }
                    }
                    catch (e) {
                        debug(e);
                    }
                    if (!fromStore) {
                        debug("Fetch from server");
                        let ret = yield this.request(word);
                        if (ret) {
                            this.store.setJson(word, ret);
                        }
                        fromStore = format(ret);
                    }
                    else {
                        debug("Got it from db");
                    }
                    return fromStore;
                })
            }
        });
        this.header = {};
        this.responseHandler_ = responseHandler || JSONResponse;
    }
    declare() {
        let declared = super.declare();
        declared.services.push("store");
        return declared;
    }
    init(params) {
        super.init(params);
        this.url = this.cfg.url;
        this.store = params.services.store;
    }
    request(word) {
        return __awaiter(this, void 0, void 0, function* () {
            debug(`Fetch ${this.url.replace("{word}", querystring.escape(word))}`);
            return this.responseHandler_(yield fetch(this.url.replace("{word}", querystring.escape(word)), {
                headers: this.header
            }));
        });
    }
}
exports.NetDict = NetDict;
function JSONResponse(res) {
    return __awaiter(this, void 0, void 0, function* () {
        let ret = yield res.text();
        try {
            return JSON.parse(ret);
        }
        catch (e) {
            debug("Res:", ret);
            debug(e);
        }
    });
}
exports.JSONResponse = JSONResponse;
