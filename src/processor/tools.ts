import { IResult, IOption } from "../types"
import { cmdsRequired } from "../util"

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
  if (op.strings.length === 1) {
    let text = op.strings[0]
    return [{
      title: text,
      text,
      value: text
    }]
  }

  return [{
    ...op
  }]
}

// const scalc = require("scalc")
export function calc(op: IOption) {
  let exp = op.strings.join(" ").trim()
  if (exp.length) {
    //NOTE: scalc has a bug that scalc("1/2.") with lead crash
    //TODO: refactor
    let result = eval(exp)
    return [{
      title: result,
      text: `${exp} = ${result}`,
      value: `${exp} = ${result}`,
      param: {
        action: "copy",
        field: "title"
      }
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

export const notify = cmdsRequired(["notify-send"], function notify(op: IOption, list: IResult[]) {
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
)
export function copy(op: IOption, list: IResult[]) {
  let field = op.strings[0] || "value"
  return list.map(item => ({
    ...item,
    param: {
      action: "copy",
      field
    }
  }))
}
import { speicalSplit } from "../util"
export function cmd(op: IOption) {
  let cmd = op.cmd || "sh"
  let args = op.args
  return [{
    title: op.title,
    text: op.text,
    value: op.value,
    param: {
      action: "cmd",
      cmd,
      args
    }
  }]
}

export function all(op: IOption, list: IResult[]): IResult[] {
  return [{
    title: "Run all",
    text: "Run all of follow",
    param: {
      action: "all",
      list
    }
  }].concat(list as any)
}

export function reload() {
  return [{
    text: "Reload copilot",
    param: {
      action: "reload"
    }
  }]
}
