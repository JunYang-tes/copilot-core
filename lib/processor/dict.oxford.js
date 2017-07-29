"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const net_dict_1 = require("./dict/net-dict");
const { debug } = require("b-logger")("copilot.dict.oxford");
class Oxford extends net_dict_1.NetDict {
    constructor() {
        super({
            format: (ret) => {
                let list = [];
                for (let result of ret.results) {
                    for (let lex of result.lexicalEntries) {
                        let p = lex.pronunciations
                            .map(e => `${e.dialects.join(" ")}[${e.phoneticSpelling}]`)
                            .join(";");
                        list.push({
                            title: ret.id,
                            text: p,
                            value: p
                        });
                        for (let entry of lex.entries) {
                            let sense = entry.senses;
                            while (sense.length) {
                                let s = sense.shift();
                                if (s.subsenses) {
                                    sense.push(...s.subsenses);
                                }
                                list.push(...s.definitions.map(d => ({
                                    text: `[Definition]${d}`
                                })));
                                if (s.examples) {
                                    list.push(...s.examples.map(e => ({
                                        text: `[example]${e.text}`
                                    })));
                                }
                            }
                        }
                    }
                }
                return list;
            }
        });
    }
    init(param) {
        super.init(param);
        this.header = {
            Accept: "application/json",
            app_id: this.cfg.id,
            app_key: this.cfg.key
        };
    }
}
let oxford = new Oxford();
oxford.default = oxford.lookup;
exports.default = oxford;
