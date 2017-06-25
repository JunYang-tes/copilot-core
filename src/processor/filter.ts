import { IResult, IOption } from "../types"
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
    debug(item.value, test.test(item.value))
    return test.test(item.value)
  })
}
export function search() {

}
