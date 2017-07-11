import * as fs from "fs"
import * as OS from "os"
import { readdir, utils } from "../util"
import { parse, resolve } from "path"
import { IResult } from "../types"

const { debug } = require("b-logger")("processor.file")
// TODO
const openCmd = "xdg-open"

export default {
  path: OS.homedir(),
  async check() {
    debug("Check xdg-open")
    try {
      utils.exec("which", openCmd)
      return {
        valid: true
      }
    } catch (e) {
      return {
        valid: false,
        msg: `No ${openCmd} found, file processors not available`
      }
    }
  },
  cd(op: { strings: string[] }) {
    let [path] = op.strings
    if (!path.startsWith("/")) {
      path = resolve(`${this.path}/${path}`)
    }
    if (fs.existsSync(path)) {
      this.path = path
    }
  },
  open(op: any, list: IResult[]) {
    return list.map(item => ({
      title: item.title,
      value: item.text,
      text: `Open ${item.text}`,
      param: {
        action: "cmd",
        cmd: "xdg-open",
        args: [item.value]
      }
    }))
  },
  async ls(op: { strings: string[] }) {
    let [path] = op.strings
    if (!path) path = this.path
    const files = await readdir(path)
    return files.map((file) => {
      const p = parse(file)
      return {
        text: file,
        title: p.name,
        value: `file:///${path}/${file}`,
      }
    })
  },
}
