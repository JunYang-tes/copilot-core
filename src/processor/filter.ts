import { IResult, IOption } from "../types"
import { search as fuzzySearch } from "../util"
const { debug } = require("b-logger")("copilot.processor.filter")

export function grep(op: IOption, list: IResult[]): IResult[] {
  let flags = ""
  let field = op.field || "value"
  if (op.i) {
    flags = "i"
  }

  debug("grep ", op)
  debug(op.strings.join("-"))
  const test: RegExp = new RegExp(op.strings.join(" "), flags)
  debug(test)
  return list.filter((item) => {
    // debug(item.value, test.test(item.value))
    return test.test(item.value)
  })
}
export function search(op: IOption, list: IResult[]) {
  debug("search ", op.strings.join(" "))
  if (op.strings.length === 0) {
    return list
  }
  let result = fuzzySearch(op.strings.join(" "), list, (item) => item.value) //fuse.search(op.strings.join(" "));
  return result.map(ret => ({
    ...list[ret.index],
    text: ret.string
  }))
}
