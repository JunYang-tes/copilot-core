import { readFileSync, existsSync } from "fs"
import { parse } from "path"
import os = require("os")
import utils from "./util"
const merge = require("deepmerge")
const { debug } = require("b-logger")("copilot.config")
const yaml = require("js-yaml")
let config: any = null
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

export function loadConfig() {
  if (!config) {
    config = yaml.safeLoad(readFileSync(lookupConfigFile()))
    try {
      let custom = yaml.safeLoad(readFileSync(lookupConfigFile("config.custom.yaml")))
      config = merge(config, custom)
    } catch (e) {
      debug("Failed to load custom config", e)
    }
    debug("Currenct config:", config)
  }
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
