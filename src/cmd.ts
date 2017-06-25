import { GuessParser } from "cli-argparser/lib/parser"
import { prepare } from "./prepare"
const { debug } = require("b-logger")("copilot.cmd")
export interface IParsedCmd {
  cmd: string,
  original: string,
  args: any
}
const parser = new GuessParser()
export function parse(cmd: string): IParsedCmd[] {
  return prepare(cmd)
    .map(ele => {
      let args
      if (ele.rest.trim().length) {
        debug("Parse ", ele.rest)
        args = parser.parse(ele.rest.trim())
      } else {
        args = {
          strings: []
        }
      }
      return {
        cmd: ele.cmd,
        original: `${ele.cmd} ${ele.rest}`,
        args
      }
    })
}
