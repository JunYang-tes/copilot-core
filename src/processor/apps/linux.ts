import utils from "../../util"
import { cmdsRequired } from "../../util"
import { readdir } from "../../util"
import { IResult } from "../../types"
import { parse } from "./x11-desktop-entry"
import { IOption } from "../../types"
const { debug, warn } = require("b-logger")("apps")
const { asyncify } = require("array-asyncify")

export interface IConfig {
  path: string[],
  icons: string[],
  launch: string
  icon: string
}
export interface InitParam {
  cfg: IConfig
}

export default {
  async init({ cfg }: InitParam) {
    debug("Init apps:", cfg)
    this.path = cfg.path
    this.cfg = cfg
    let icons: { [name: string]: string } = {}
    let app = /\.desktop$/
    this.entires = []
    let iconReg = new RegExp(cfg.icon, "i")
    await Promise.all(cfg.icons.map(async (p: string) => {
      (await readdir(utils.path(p)))
        .filter((f: string) => iconReg.test(f))
        .reduce((ret: any, next) => {
          ret[next.replace(/\..*$/, "")] = `${utils.path(p)}/${next}`
          return ret
        }, icons)
    }))
    //TODO: gtk-launch do not support custom apps dir. Refact launch way
    let launder = (entryName: string) => {
      return (op: IOption, list: IResult[]) => {
        return [{
          title: entryName,
          value: `Open ${op.strings.join(" ")} with ${entryName}`,
          text: `Open ${op.strings.join(" ")} with ${entryName}`,
          param: {
            action: "cmd",
            cmd: cfg.launch,
            args: [entryName, ...op.strings]
          }
        }]
      }
    }
    await Promise.all(this.path.map(async (p: string) => {
      p = utils.path(p)
      let entires = (await readdir(p))
        .filter(name => app.test(name))
      entires = await asyncify(entires)
        .map(async (entryFile: string) => {
          try {
            let entry = await parse(`${p}/${entryFile}`)
            let result: IResult = {
              title: entry.name,
              text: entry.name,
              icon: entry.icon.startsWith("/") ? entry.icon : icons[entry.icon],
              value: entry.name,
              param: {
                entryName: entryFile,
                path: `${p}/${entryFile}`
              }
            }
            let name = entry.name.replace(/\s.*/, "")
            if (name in this) {
              name = entry.name.replace(/\s/g, "")
            }
            let i = 1
            let tmp = name
            while (tmp in this) {
              tmp = name + i
              i++
            }
            name = tmp
            // this[name] = launder(entryFile)
            debug(`Create launcher:`, entry.name, `${p}/${entryFile}`)
            return result
          } catch (e) {
            warn(`Failed to parse ${p}/${entryFile}`, e)
          }
        })
        .filter(i => i)
      debug(`Loaded entries:${entires.length}`)
      this.entires.push(...entires)
    }))
    this.launch = cmdsRequired([this.cfg.launch], this.launch)
  },
  list() {
    return this.entires
  },
  launch(op: IOption, list: IResult[]) {
    let uri = op.uri || ""
    return list.map(i => ({
      ...i,
      text: `Run ${i.text}`,
      param: {
        action: "cmd",
        cmd: this.cfg.launch,
        args: uri.length ? [i.param.entryName, uri] : [i.param.entryName]
      }
    }))
  }
}
