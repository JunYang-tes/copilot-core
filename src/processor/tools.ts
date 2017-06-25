import { IResult, IOption } from "../types"
export function grep(op: { strings: [string] }, list: IResult[]): IResult[] {
  let test: RegExp = new RegExp(op.strings.join(" "))
  return list.filter(item => test.test(item.value))
}
export function head(op: { strings: [string] }, list: IResult[]): IResult[] {
  let n = Number(op.strings[0])
  if (n > list.length) {
    return [...list]
  }
  return list.slice(0, n)
}
export function tail(op: { strings: [string] }, list: IResult[]): IResult[] {
  let n = Number(op.strings[0])
  if (n > list.length) {
    return [...list]
  }
  return list.slice(-n, list.length)
}
export function count(op: IOption, list: IResult[]) {
  return {
    title: "Count",
    text: list.length,
    value: list.length
  }
}
