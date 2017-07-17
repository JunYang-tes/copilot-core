import * as fs from "fs"
import utils from "../util"
import { stat } from "../util"
import * as util from "util"
import * as path from "path"
import { Check, InvalidResult, Processor, ProcessorName } from "../types"
import { loadConfig, getConfig } from "../config"
import { getServices } from "../services"

const { asyncify } = require("array-asyncify")
const { debug, warn, error } = require("b-logger")("processor.loader")
const readdir: (path: string | Buffer) => Promise<string[]> = utils.promisify(fs.readdir)

interface IParsed {
  processors?: { [name: string]: Processor },
  errors?: Array<{ name: string, msg: string }> | string
}
function isCheckResultArray(x: any): x is InvalidResult[] {
  return x instanceof Array
}

async function parse(
  obj: any,
  fileName: string,
  name: ({
    fileName,
    funName }: { fileName: string, funName: string }) => string): Promise<IParsed> {
  const processors: { [name: string]: Processor } = {}
  //inject services and config
  let param = {
    cfg: getConfig(name({ fileName, funName: "init" })),
    services: {}
  }
  if (obj.declare && util.isFunction(obj.declare)) {
    let declare = obj.declare()
    declare.params = declare.params || {}
    debug("declared dependencies:", declare)
    if (declare.services) {
      param.services = declare.services
        .map(serviceName => {
          let serviceParam = declare.params[serviceName] || {}
          return {
            key: serviceName,
            value: getServices(serviceName, {
              ...serviceName,
              namespace: name({ fileName, funName: "" })
            })
          }
        })
        .reduce((ret, next) => (ret[next.key] = next.value, ret), {})
    }
  }

  if (obj.init && util.isFunction(obj.init)) {
    await obj.init(param);//getConfig(name({ fileName, funName: "init" })))
  }
  if (obj.check && util.isFunction(obj.check)) {
    const check = obj.check as Check
    const checkResult = await check()
    if (checkResult) {
      if (isCheckResultArray(checkResult)) {
        const invalid = checkResult as InvalidResult[]
        Object.keys(obj)
          .filter((key) => key !== "check" && !/_$/.test(key) && invalid.every(e => e.key !== key))
          .map(key => obj[key].bind(obj))
          .forEach(fun => {
            processors[name({ funName: fun.name, fileName }).replace(/\.default$/, "")] = fun
          })
        return {
          processors,
          errors: invalid.map(e => ({ name: e.key, msg: e.msg })),
        }
      } else {
        if (checkResult.valid) {
          Object.keys(obj)
            .filter(key => key !== "check" && key !== "init" && !/_$/.test(key) && util.isFunction(obj[key]))
            .map(key => obj[key].bind(obj))
            .forEach(fun => {
              debug(`Load processor ${fun.name}`)
              processors[name({ funName: fun.name, fileName })] = fun
            })
        } else {
          return {
            errors: checkResult.msg,
          }
        }
      }
    }
  } else {
    warn(`check return falsy. ${fileName}`)
    debug(Object.keys(obj))
    Object.keys(obj)
      .map(key => {
        debug(`${key} is function:`, util.isFunction(obj[key]))
        return key
      })
      .filter(key => key !== "check" && util.isFunction(obj[key]))
      // .map(key => obj[key].bind(obj))
      .forEach(key => {
        let fun = obj[key]
        processors[name({ funName: key, fileName }).replace(/\.default$/, "")] = fun.bind(obj)
      })
  }
  return { processors }
}

export async function load({
  dir = __dirname,
  name = ({ fileName, funName }: { fileName: string, funName: string }) =>
    `buildin.${fileName}.${funName.replace("bound ", "")}` }) {
  debug(`Load processors from ${dir}`)
  let files = await readdir(dir)
  let processors: { [name: string]: Processor } = {}
  let errors: {
    [filename: string]: Array<{ name: string, msg: string }> | string
  } = {}

  let modules = await asyncify(files)
    .filter(async (file: string) => {
      debug("filter", file)
      if (/\.js$/.test(file) && file !== "index.js") {
        return true
      } else {
        return (await stat(`${dir}/${file}`)).isDirectory()
      }
    })
    .map((file: string) => {
      try {
        let ret = {
          module: require(`${dir}/${file}`),
          name: path.parse(file).name
        }
        return ret
      } catch (e) {
        error(`Failed to load ${dir}/${file}`, e)
      }
    })
    .filter(i => i)
  debug("Modules:", modules)
  for (const item of modules) {
    let { module, name: fileName } = item
    debug(`Load ${fileName}`)
    if ("default" in module) {
      const defvalue = module.default
      if (util.isFunction(defvalue)) {
        processors[name({ funName: defvalue.name, fileName })] = defvalue
        continue;
      } else {
        module = defvalue
      }
    }
    try {
      const parsed = await parse(module, fileName, name)
      if (parsed.processors) {
        Object.assign(processors, parsed.processors)
      }
      if (parsed.errors) {
        errors[fileName] = parsed.errors
      }
    } catch (e) {
      errors[path.resolve(`${dir}/${fileName}`)] = `Failed to load processor from file ${fileName},${e}`
    }
  }
  return {
    processors,
    errors,
  }
}
