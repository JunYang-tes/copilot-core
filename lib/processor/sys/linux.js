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
function reboot() {
    return [{
            title: "Reboot",
            text: "Reboot system",
            value: "Reboot system",
            param: {
                action: "cmd",
                cmd: "systemctrl",
                args: ["reboot"]
            }
        }];
}
exports.reboot = reboot;
function mute() {
    return [{
            title: "Mute",
            text: "Close audio output"
        }];
}
exports.mute = mute;
function ip() {
}
exports.ip = ip;
function wifiOff() {
}
exports.wifiOff = wifiOff;
function wifiOn() {
}
exports.wifiOn = wifiOn;
