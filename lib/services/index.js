"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Store_1 = require("./Store");
const Cache_1 = require("./Cache");
const SocketIO_1 = require("./SocketIO");
const services = {
    store: Store_1.Store,
    cache: Cache_1.Cache,
    socketio: SocketIO_1.SocketIO
};
function getServices(servicesName, serverParam) {
    return new services[servicesName](serverParam);
}
exports.getServices = getServices;
