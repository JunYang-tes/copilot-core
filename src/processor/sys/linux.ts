export function suspend() {
  return [{
    title: "Supend",
    text: "Suspend system",
    value: "Suspend system",
    param: {
      action: "cmd",
      cmd: "systemctl",
      args: ["suspend"]
    }
  }]
}
export function reboot() {
  return [{
    title: "Reboot",
    text: "Reboot system",
    value: "Reboot system",
    param: {
      action: "cmd",
      cmd: "systemctrl",
      args: ["reboot"]
    }
  }]
}

export function xkill() {
  return [{
    title: "Kill",
    param: {
      action: "cmd",
      cmd: "xkill"
    }
  }]
}

export function mute() {
  return [{
    title: "Mute",
    text: "Close audio output"
  }]
}

export function ip() {

}

export function wifiOff() {

}

export function wifiOn() {

}