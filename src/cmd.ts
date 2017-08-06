import { GuessParser } from "cli-argparser/lib/parser"
import { prepare, split } from "./prepare"
const { debug } = require("b-logger")("copilot.cmd")
export interface IParsedCmd {
  cmd: string,
  originalCmd: string,
  original: string,
  args: any
}
export interface ICmdInfo {
  parsed: IParsedCmd[],
  original: {
    lastCmd: string,
    lastCmdHasOpt: boolean,
  }
}

const parser = new GuessParser()
export function parse(cmd: string): ICmdInfo {
  let splited = split(cmd)
  let lastCmd = splited[splited.length - 1]
  return {
    parsed: prepare(cmd)
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
          cmd: ele.cmd.trim(),
          originalCmd: ele.cmd.trim(),
          original: `${ele.cmd} ${ele.rest}`.trim(),
          args
        }
      }),
    original: {
      lastCmd: lastCmd.cmd,
      lastCmdHasOpt: lastCmd.rest.trim().length > 0
    }
  }
}
