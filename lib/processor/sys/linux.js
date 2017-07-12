"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function suspend() {
    return [{
            title: "Supend",
            text: "Suspend system",
            value: "Suspend system",
            param: {
                action: "cmd",
                cmd: "systemctl",
                args: ["suspend"]
            }
        }];
}
exports.suspend = suspend;
