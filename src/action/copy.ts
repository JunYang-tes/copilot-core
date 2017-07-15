import { ICopyParam, IResult } from "../types"
import copyPaste = require("clipboardy")
const { debug, error } = require("b-logger")("copilot.action.copy")
export async function copy(param: ICopyParam, item: IResult) {
  let value = item.value
  if (param && param.field && param.field in item) {
    value = item[param.field]
  }
  try {
    debug("copy ", value)
    await copyPaste.write("" + value)
  } catch (e) {
    error("Failed to copy ", e)
  }
}
