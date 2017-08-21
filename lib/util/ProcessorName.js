"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function prefix(p) {
    return ({ fileName, funName }) => `${p}.${fileName}.${funName.replace("bound ", "")}`;
}
exports.prefix = prefix;
