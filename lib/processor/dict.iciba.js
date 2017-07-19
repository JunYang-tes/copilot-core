"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const net_dict_1 = require("./dict/net-dict");
let iciba = new net_dict_1.NetDict({
    format: (ret) => {
        if (ret.is_CRI) {
            let symbol = ret.symbols;
            let ph = symbol.map(item => `[${item.ph_en}],[${item.ph_am}]`).join(";");
            let means = symbol[0].parts
                .map(p => {
                let mean = `${p.part},${p.means.join(" ")}`;
                return {
                    text: mean,
                    value: mean
                };
            });
            return [{
                    title: ret.word_name,
                    text: ph,
                    value: ph
                }, ...means];
        }
        else {
            let symbols = ret.symbols;
            let list = [];
            for (let sym of symbols) {
                list.push({
                    title: ret.word_name,
                    text: sym.word_symbol,
                    value: sym.word_symbol
                });
                for (let p of sym.parts) {
                    list.push(...p.means.map(m => ({ text: m.word_mean, value: m.word_mean })));
                }
            }
            return list;
        }
    }
});
iciba.default = iciba.lookup;
exports.default = iciba;
