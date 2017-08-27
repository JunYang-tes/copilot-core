import { load as jsLoad } from "./processor/index"
import { prefix, nameFn } from "./util/ProcessorName"
import { getConfigByKeys } from "./config"
import { Processor, IOption } from "./types"
import { spawn } from "child_process"
import { homePath } from "./util"
import { readdir, stat, speicalSplit } from "./util"
const { debug, warn } = require("b-logger")("copilot.external")
const { asyncify } = require("array-asyncify")
const { parse, sep: PATH_SEP, join: pathJoin } = require("path")
const yaml = require("js-yaml")

async function loadFromPathArray(path: string[],
  load: (processorsPath: string) => any) {
  debug("Load external processor from ")
  debug(path)
  return await asyncify(path)
    .map(async p => {
      p = homePath(p)
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
        debug("load external  processor from ", p)
        return await load(p)
      } catch (e) {
        warn(e)
      }
    })
    .filter((i: any) => i)
}

async function loadJsProcessor(path: string[]) {
  debug("Load external js processor from ")
  debug(path)
  return loadFromPathArray(path, (p) => {
    let { name } = parse(p)
    return jsLoad({
      dir: p,
      name: prefix(`js.${name}`)
    })
  })
}
function wrapper(filePath) {
  return (op: IOption, list: any) => {
    debug(speicalSplit(op._original))
    let cp = spawn(filePath, speicalSplit(op._original).slice(1))
    if (list) {
      cp.stdin.write(yaml.dump(list))
    }
    let out = ""
    let resolver;
    let rejector;
    let promsie = new Promise((res, rej) => {
      resolver = res
      rejector = rej
    })
    cp.stdout.setEncoding("utf8")
    cp.stdout.on("data", d => out += d)
    cp.on("close", (code) => {
      try {
        if (code === 0) {
          resolver(yaml.safeLoad(out))
        } else {
          rejector(new Error("Child process return non-zero"))
        }
      } catch (e) {
        rejector(e)
      }
    })
    return promsie
  }
}
async function loadScript(path, processorName: nameFn) {
  return asyncify(await readdir(path))
    .filter(async file => {
      try {
        return (await stat(pathJoin(path, file))).isFile()
      } catch (e) {
        warn(e)
        return false
      }
    })
    .map(file => {
      debug("load script:", file)
      let { dir, name } = parse(pathJoin(path, file))
      debug(pathJoin(path, file))
      debug(dir, name)
      let idx = dir.lastIndexOf(PATH_SEP)
      return {
        filePath: pathJoin(path, file),
        fileName: dir.slice(idx + 1),
        processorName: name
      }
    })
    .reduce((ret, next: any) => (ret.processors[processorName(next.fileName, next.processorName)]
      = wrapper(next.filePath), ret), { processors: {} })
}

async function loadScriptProcessor(path: string[]) {
  debug("Load external script processors from ")
  debug(path)
  let name = prefix("spt")
  return loadFromPathArray(path, (dir: string) => loadScript(dir, name))
}

export interface IProcessors {
  processors: {
    [name: string]: Processor
  }
  error: any
}
export async function load(): Promise<IProcessors[]> {
  return (await loadJsProcessor(getConfigByKeys("external.processor", "js", "path") || []))
    .concat(await loadScriptProcessor(getConfigByKeys("external.processor", "script", "path") || []))
}
