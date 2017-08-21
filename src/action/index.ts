import * as cmd from "./cmd"
import { complete } from "./run-complete"
import { action } from "../types"
import { timeout } from "./run-timeout"
import { copy } from "./copy"
import { reload } from "./reload"
const actions: { [name: string]: action } = {
  cmd: cmd.cmd,
  complete,
  timeout,
  copy,
  reload,
}
export default actions
