import * as fs from "fs"
import { readFile } from "../../util"
const ini = require("ini")
export interface IDesktopEntry {
  name: string,
  icon: string
}

export async function parse(path: string): Promise<IDesktopEntry> {
  let content = await readFile(path, "utf-8")
  let entry = (ini.parse(content))
  return {
    name: entry["Desktop Entry"].Name,
    icon: entry["Desktop Entry"].Icon
  }
}
