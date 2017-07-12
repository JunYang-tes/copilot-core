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

a => [[], [], []]

function a(arr) {
  if (arr.length === 1) {
    return [arr]
  } else {
    let ret = [];
    for (let i = 0; i < arr.length; i++) {
      let tmp = a(arr.slice(0, i).concat(arr.slice(i + 1)))
      for (let t of tmp) t.unshift(arr[i])
      ret.push(...tmp)
    }
    return ret;
  }
}

function Cn(arr, n) {
  if (n === 1)
    return arr
  else {
    let ret = []
    for (let i = 0; i < n; i++) {
      ret.push(arr[i])
      ret.push(...Cn(arr.slice(0, i).concat(arr.slice(i + 1)), n - 1))
    }
  }
}

function c(arr) {
  let ret = arr;
  for (let i = 2; i < arr.length; i++) {
    ret.push(...Cn(arr, i))
  }
}



A = { A }
AB = { A, B }

ABC = { A, B, C, AB, AC, BC, ABC }
ABCD =
    = { A, B, C, D, AB, AC, AD, BC, BD, CD, ABC, ABD, ACD, ABCD }