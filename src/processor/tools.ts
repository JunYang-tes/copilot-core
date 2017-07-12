import { IResult, IOption } from "../types"

export function head(op: { strings: [string] }, list: IResult[]): IResult[] {
  let n = Number(op.strings[0])
  if (n > list.length) {
    return [...list]
  }
  return list.slice(0, n)
}
export function tail(op: { strings: [string] }, list: IResult[]): IResult[] {
  let n = Number(op.strings[0])
  if (!Number.isFinite(n)) {
    return [{
      title: "Tail",
      text: "Select last nth items",
      value: "Select last nth items"
    }]
  }

  if (n > list.length) {
    return [...list]
  }
  return list.slice(-n, list.length)
}
export function count(op: IOption, list: IResult[]) {
  return [{
    title: "Count",
    text: list.length,
    value: list.length
  }]
}
export function now() {
  let d = new Date()
  return [{
    title: "Now",
    text: d.toLocaleString(),
    value: d.getTime()
  }]
}
export function toPipe(op: IOption) {
  return [{
    ...op
  }]
}

const scalc = require("scalc")
export function calc(op: IOption) {
  let exp = op.strings.join(" ").trim()
  if (exp.length) {
    let result = scalc(exp)
    return [{
      title: result,
      text: `${exp} = ${result}`,
      value: ""
    }]
  } else {
    return [{
      title: "Calculator",
      text: "Calculate math expression"
    }]
  }
}

export function echo(op: IOption) {
  let text = op.strings.join(" ")
  return [{
    title: text,
    text,
    value: text
  }]
}
export function timeout(op: IOption, list: IResult[]) {
  let timeout = Number(op.min) * 60 * 1000 || Number(op.sec) * 1000 || 0
  return list.map(item => ({
    title: "Do after time out",
    text: `After ${timeout / 1000}s ${item.title}`,
    value: `After ${timeout / 1000}s ${item.title}`,
    param: {
      action: "timeout",
      timeout,
      original: item
    }
  }))
}

export function notify(op: IOption, list: IResult[]) {
  //TODO:cross-platform
  if (list.length) {
    return list.map(item => ({
      ...item,
      title: "Send notification",
      param: {
        action: "cmd",
        cmd: "notify-send",
        args: [item.title, item.value]
      }
    }))
  } else {
    let summary = op.summary || op.strings.join(" ");
    let body = op.body || "";

    return [{
      title: `Send notification`,
      text: summary,
      param: {
        action: "cmd",
        cmd: "notify-send",
        args: [summary, body]
      }
    }]
  }
}
