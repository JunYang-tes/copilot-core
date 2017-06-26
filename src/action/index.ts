import * as cmd from "./cmd"
import { complete } from "./run-complete"
import { action } from "../types"
const actions: { [name: string]: action } = {
  cmd: cmd.cmd,
  complete
}
export default actions
