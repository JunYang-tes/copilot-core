import * as cmd from "./cmd"
import { complete } from "./run-complete"
import { action } from "../types"
import { timeout } from "./run-timeout"
import { copy } from "./copy"
import { reload } from "./reload"
import { runfunc } from "./run-function"
const actions: { [name: string]: action } = {
  cmd: cmd.cmd,
  complete,
  timeout,
  copy,
  reload,
  func: runfunc
}
export default actions
