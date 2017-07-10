"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
const { debug, error } = require("b-logger")("copilot.test");
index_1.startUp()
    .then(() => {
    index_1.handle("bing test")
        .then((ret) => {
        debug(ret);
    });
})
    .catch(e => {
});
