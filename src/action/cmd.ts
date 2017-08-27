import { ICmdParam } from "../types"
import { exec } from "../util"
const { debug, error } = require("b-logger")("copilot.action.cmd")
export async function cmd(param: ICmdParam) {
  try {
    await exec(param.cmd, param.args, {
      detached: true
    })
  } catch (e) {
    error(`Failed to execute `, param)
    error(e)
  }
}
