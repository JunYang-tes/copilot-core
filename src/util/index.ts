// const spawn = require("child_process").spawn
import { spawn } from "child_process"
import * as fs from "fs"
import * as util from "util"
import * as os from "os"
const helper = {
  path: (str: string) => {
    return str.replace(/^\s*~/, os.homedir)
  },
  exec: (command: string, args: any, options = {}) => new Promise((res: (_: string) => void, rej) => {
    let arg = util.isArray(args) ? args : [args]
    let cmd = spawn(command, arg, options)
    let errorStr = ""
    let stdout = ""
    cmd.stderr.on("data", (data: Buffer) => {
      errorStr += data
    })
    cmd.stdout.on("data", (data: Buffer) => {
      stdout += data.toString()
    })
    cmd.on("close", (code: number) => {
      if (code === 0) {
        res(stdout)
      } else {
        rej({
          code,
          errorStr
        })
      }
    })
  }),
  sh: (command: string, args: any) => helper.exec(command, args, { shell: true }),

  promisify: (api: Function) => (...param: any[]) => new Promise((res: (...arg: any[]) => void, rej) => {
    api(...param, (err: any, ...rest: any[]) => {
      if (err) {
        rej(err)
      } else {
        res(...rest)
      }
    })
  }),
}
type API = () => any
export const stat: (path: string | Buffer) => Promise<fs.Stats> = helper.promisify(fs.stat)
export const readdir: (path: string | Buffer) => Promise<string[]> = helper.promisify(fs.readdir)
export const readFile: (path: string, encoding: string) => Promise<string> = helper.promisify(fs.readFile)
export default helper
