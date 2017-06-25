import * as cmd from "./cmd"
import { action } from "../types"
const actions: { [name: string]: action } = {
  cmd: cmd.cmd
}
export default actions
