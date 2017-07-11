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
