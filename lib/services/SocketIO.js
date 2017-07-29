"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../config");
const EventEmitter = require("events");
const { debug, error } = require("b-logger")("copilot.services.socketio");
const server = require("http").createServer();
let port = 9999;
try {
    port = config_1.getServices().socketio.port;
}
catch (e) {
    debug("Failed to get port from config,", e);
}
try {
    server.listen(port);
}
catch (e) {
    error(`Failed to listen at ${port},services related this port will fail`);
}
const io = require("socket.io")(server);
class SocketIO {
    constructor({ namespace }) {
        this.events = new EventEmitter();
        this.io = io.of(namespace);
        this.io.on("connection", (client) => {
            debug("client connected");
            this.events.emit("connection", {
                send(event, msg) {
                    client.send(event, msg);
                },
                on(event, cb) {
                    client.on(event, cb);
                },
                onJson(event, cb) {
                    client.on(event, (arg) => {
                        cb(JSON.parse(arg));
                    });
                }
            });
        });
    }
    on(event, cb) {
        this.events.on(event, cb);
    }
    emit(event, msg) {
        this.io.emit(event, msg);
    }
}
exports.SocketIO = SocketIO;
const WebSocket = require("ws");
const wss = new WebSocket.Server({ server });
const { debug: wsDebug } = require("b-logger")("copilot.services.WebSocket");
class OriginalWebSocket {
    constructor({ namespace }) {
        wsDebug("namespace", namespace);
        this.events = new EventEmitter();
        wss.on("connection", (ws, req) => {
            wsDebug(req.url);
            wsDebug(req.url.substring(1).replace(/\\/g, "."));
            if (req.url.substring(1).replace(/\\/g, ".") === namespace) {
                wsDebug("client connected", ws);
                let clientEvents = new EventEmitter();
                ws.on("message", (data) => {
                    wsDebug(data);
                    if (typeof data === "string") {
                        let json = JSON.parse(data);
                        clientEvents.emit(json.event, json.data);
                    }
                });
                ws.on("close", () => {
                    wsDebug("close");
                    this.events.emit("close");
                });
                this.events.emit("connection", {
                    send(event, data) {
                        ws.send(JSON.stringify({
                            event,
                            data
                        }));
                    },
                    onJson(event, cb) {
                        clientEvents.on(event, cb);
                    },
                    close() {
                        ws.terminate();
                    }
                });
            }
            wsDebug("connected");
        });
    }
    on(event, cb) {
        this.events.on(event, cb);
    }
    emit(event, msg) {
    }
}
exports.OriginalWebSocket = OriginalWebSocket;
new SocketIO({ namespace: "test" });
new OriginalWebSocket({ namespace: "test" });
