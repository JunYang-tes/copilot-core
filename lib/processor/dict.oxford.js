"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const net_dict_1 = require("./dict/net-dict");
const { debug } = require("b-logger")("copilot.dict.oxford");
class Oxford extends net_dict_1.NetDict {
    constructor() {
        super({
            format: (ret) => {
                return [];
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
