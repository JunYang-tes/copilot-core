import { load as jsLoad } from "./processor/index"
import { prefix } from "./util/ProcessorName"
import { getConfigByKeys } from "./config"
import { Processor } from "./types"
import utils from "./util"
import { readdir, stat } from "./util"
const { debug, warn } = require("b-logger")("copilot.external")
const { asyncify } = require("array-asyncify")
const { parse } = require("path")
async function loadJsProcessor(path: string[]) {
  debug("Load external js processor from ")
  debug(path)
  debug(asyncify)
  return await asyncify(path)
    .map(async p => {
      p = utils.path(p)
      try {
        let dirs = await readdir(p)
        return asyncify(dirs)
          .filter(async file => (await stat(`${p}/${file}`)).isDirectory())
          .map(f => `${p}/${f}`)
      } catch (e) {
        warn(e)
      }
      return []
    })
    .reduce((ret, next) => (ret.push(...next), ret), [])
    .map(async p => {
      try {
        debug("load external js processor from ", p)
        let { name } = parse(p)
        return await jsLoad({
          dir: p,
          name: prefix(`js.${name}`)
        })
      } catch (e) {
        warn(e)
      }
    })
    .filter((i: any) => i)
}
export interface IProcessors {
  processors: {
    [name: string]: Processor
  }
  error: any
}
export function load(): Promise<IProcessors[]> {
  return loadJsProcessor(getConfigByKeys("external.processor", "js", "path") || [])
}
