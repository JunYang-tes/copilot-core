import { readFileSync } from "fs"
import os = require("os")
const { debug } = require("b-logger")("copilot.config")
const yaml = require("js-yaml")
let config: any = null
export function getAlias(): { [alias: string]: string } {

  return config.alias
}
export function loadConfig() {
  if (!config) {
    config = yaml.safeLoad(readFileSync(`${__dirname}/../config.yaml`))
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
