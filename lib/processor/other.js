"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tws = require("twss");
tws.threshold = 0.5;
function twss(op) {
    let s = op.strings.join(" ");
    return [{
            title: `TWSS? ${s}`,
            text: `${tws.is(s)},  ${tws.probability(s)}`,
            value: `${tws.is(s)},  ${tws.probability(s)}`
        }];
}
exports.twss = twss;
function lucky() {
    let days = ["昨天", "今天", "明天"];
    let animals = ["猪", "狗", "猫", "小可爱"];
    return [{
            title: "",
            text: `Yongyong ${days[(Math.random() * days.length) | 0]} 是 ${animals[(Math.random() * animals.length) | 0]}`
        }];
}
exports.lucky = lucky;
