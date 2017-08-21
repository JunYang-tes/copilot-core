import { startUp } from "../index"
const { debug, error } = require("b-logger")("copilot.action.cmd")
export async function reload() {
  try {
    await startUp()
  } catch (e) {
    error(`Failed to execute `)
    error(e)
  }
}
