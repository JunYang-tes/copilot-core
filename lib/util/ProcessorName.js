"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function prefix(p) {
    return (fileName, processorName) => `${p}.${fileName}.${processorName.replace("bound ", "")}`;
}
exports.prefix = prefix;
