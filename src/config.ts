import { readFileSync, existsSync } from "fs"
import { parse } from "path"
import os = require("os")
import utils from "./util"
const { debug } = require("b-logger")("copilot.config")
const yaml = require("js-yaml")
let config: any = null
export function getAlias(): { [alias: string]: string } {

  return config.alias
}
function lookupConfigFile() {
  if (existsSync(`${utils.path("~/.config/copilot/config.yaml")}`)) {
    return `${utils.path("~/.config/copilot/config.yaml")}`
  }
  let entryPoint = parse(process.argv[1]).dir
  if (existsSync(`${entryPoint}/config.yaml`)) {
    return `${entryPoint}/config.yaml`
  }
  if (existsSync(`${__dirname}/../config.yaml`)) {
    return `${__dirname}/../config.yaml`
  }
  throw new Error("No config.yaml found")
}

export function loadConfig() {
  if (!config) {
    config = yaml.safeLoad(readFileSync(lookupConfigFile()))
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
