import { readFileSync, readdirSync, existsSync, statSync } from "fs"
import { parse } from "path"
import os = require("os")
import utils from "./util"
const merge = require("deepmerge")
const { debug, warn } = require("b-logger")("copilot.config")
const yaml = require("js-yaml")
let config: any = null
function loadConfig() {
  if (!config) {
    config = yaml.safeLoad(readFileSync(lookupConfigFile()))
    try {
      let custom = yaml.safeLoad(readFileSync(lookupConfigFile("config.custom.yaml")))
      config = merge(config, custom)
    } catch (e) {
      debug("Failed to load custom config", e)
    }
    //load external processors' config file
    loadConfig4ExProcessors(getConfigByKeys("external.processor", "js", "path") || [])
    loadConfig4ExProcessors(getConfigByKeys("external.processor", "script", "path") || [])
    debug("Currenct config:", config)
    aliasInfoFix();
    processInfoFix();
  }
}
loadConfig()
function loadConfig4ExProcessors(path: string[]) {
  debug("merge external processor's config")
  path.map(p => {
    //p is a path of processors,each dir in p is a processor
    p = utils.path(p)
    try {
      return readdirSync(`${p}`)
      .filter(f => statSync(`${p}/${f}`)
      .isDirectory() && existsSync(`${p}/${f}/config.yaml`))
      .map(f => `${p}/${f}/config.yaml`)
    } catch (e) {
      warn(e)
    }
    return []
  })
    .forEach(p => {
      p.forEach(configFile => {
        try {
          let c = yaml.safeLoad(readFileSync(configFile))
          config.processors = merge(config.processors, c.processors || {})
          config.processorsInfo = merge(config.processorsInfo, c.processorsInfo || {})
        } catch (e) {
          warn("Failed to copy config section, config file is:", e)
          warn(e)
        }
      });
    })

}

export function getAlias(): { [alias: string]: string } {
  return config.alias
}
function lookupConfigFile(name = "config.yaml") {
  let entryPoint = parse(process.argv[1]).dir
  let paths = [
    utils.path(`~/.config/copilot/${name}`),
    `${entryPoint}/${name}`,
    `${__dirname}/../${name}`
  ]
  for (let p of paths) {
    if (existsSync(p)) {
      return p
    }
  }
  throw new Error("No config.yaml found")
}

function infoFix(keys, info, name = (key) => key) {
  let alias = config.alias;
  for (let alia of keys) {
    if (alia in info) {
      let item = info[alia]
      item.icon = item.icon || alia

      if (!info[alia].title) {
        info[alia].title = alia
      }
      if (!info[alia].text && !info[alia].value) {
        info[alia].text = info[alia].value = name(alia)
      } else if (!info[alia].value) {
        info[alia].value = info[alia].text
      } else if (!info[alia].text) {
        info[alia].text = info[alia].value
      }
    } else {
      info[alia] = {
        title: alia,
        text: name(alia),
        value: name(alia),
        icon: alia
      }
    }
  }
}

function aliasInfoFix() {
  infoFix(Object.keys(config.alias), config.aliasInfo)
  // let info = config.aliasInfo;
  // let alias = config.alias;
  // for (let alia of Object.keys(alias)) {
  //   if (alia in info) {
  //     if (!info[alia].title) {
  //       info[alia].title = alia
  //     }
  //     if (!info[alia].text && !info[alia].value) {
  //       info[alia].text = info[alia].value = "Alias hint"
  //     } else if (!info[alia].value) {
  //       info[alia].value = info[alia].text
  //     } else if (!info[alia].text) {
  //       info[alia].text = info[alia].value
  //     }

  //   } else {
  //     info[alia] = {
  //       title: alia,
  //       text: "Alias hint",
  //       value: "Alias hint",
  //     }
  //   }
  // }
}
function processInfoFix() {
  infoFix(Object.keys(config.processorsInfo), config.processorsInfo)
}

export function getUsing(): string[] {
  return Array.from<string>(config.using || [])
}
export function getConfig(key: string) {
  if (`${key}[${os.platform()}]` in config.processors) {
    return config.processors[`${key}[${os.platform()}]`]
  } else if (key in config.processors) {
    return config.processors[key]
  } else {
    debug("No config for ", key)
  }
  return {}
}
export function getAliasInfo() {
  return config.aliasInfo
}
export function getProcessorsInfo() {
  return config.processorsInfo
}
export function getServices() {
  return config.services
}
export function getConfigByKeys(...params: string[]) {
  let key = params.shift()
  let obj = config[key]
  while (params.length && obj !== null && obj !== undefined) {
    key = params.shift()
    obj = obj[key]
  }
  return obj
}
