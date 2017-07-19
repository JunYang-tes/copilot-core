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
const index_1 = require("./index");
const { debug, error } = require("b-logger")("copilot.test");
const Store_1 = require("./services/Store");
index_1.startUp()
    .then(() => __awaiter(this, void 0, void 0, function* () {
    index_1.handle("buildin.dict.oxford hello$")
        .then((ret) => {
        index_1.handle("buildin.dict.oxford hello$")
            .then(console.log)
            .catch(console.error);
        debug(ret);
    });
    let store = new Store_1.Store({ namespace: "mystore" });
    debug("setJSON");
    yield store.setJson("hello", { a: 1, b: 2 });
    debug("getJSON");
    debug(yield store.getJson("hello"));
}))
    .catch(e => {
    debug(e);
});
