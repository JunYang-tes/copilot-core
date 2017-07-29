"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SocketIO_1 = require("./SocketIO");
class SingleClientServicesCall {
    constructor({ namespace }) {
        this.socket = new SocketIO_1.SocketIO({ namespace });
        this.socket.on("connection", (arg) => {
            if (this.client) {
                arg.send(".error", "There is already a client connected");
            }
            else {
                this.client = arg;
                this.client.onJson(".response", (res) => {
                    if ("seq" in res) {
                        let handler = this.calls[+res.seq];
                        if (res.result) {
                            handler.res(...res.result);
                        }
                        else {
                            handler.rej(new Error(res.error || "Unknow"));
                            delete this.calls[+res.seq];
                        }
                    }
                });
            }
        });
    }
    call(method, ...args) {
        this.client.send(method, {
            seq: this.seq++,
            args
        });
        return new Promise((res, rej) => {
            this.calls[this.seq - 1] = {
                res,
                rej
            };
        });
    }
}
exports.SingleClientServicesCall = SingleClientServicesCall;
