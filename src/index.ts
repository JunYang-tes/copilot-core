import { load } from "./processor/index"
import { IResult, Processor } from "./types"
import { parse, IParsedCmd } from "./cmd"
import { IconHelper } from "./icon"
import {
  loadConfig,
  getConfig,
  getUsing,
  getAlias,
  getAliasInfo,
  getProcessorsInfo,
} from "./config"
import action from "./action"
import { Cache } from "./util/cache"
const { debug, warn, error } = require("b-logger")("copilot.main")
const { asyncify } = require("array-asyncify")
const iconHelper = new IconHelper([`${__dirname}/../icon`])

interface ICacheItem {
  result: IResult[],
  cmd: string
}
let processors: {
  [name: string]: Processor
} = null;
let processorNames: string[]
let cache = new Cache<ICacheItem>()

export async function startUp() {
  debug("@startUp")
  try {
    loadConfig()
  } catch (e) {
    error(`Failed to load config:`, e)
  }

  let loaded = await load({})
  processors = loaded.processors
  debug("Processors:", processors)
  Object.keys(loaded.errors)
    .forEach(key => {
      warn(`Failed to load ${key}`, loaded.errors[key])
    })
  processorNames = Object.keys(processors)
}
export function run(result: IResult) {
  if (result.param && ("action" in result.param)) {
    debug("run:", result.param)
    action[result.param.action](result.param)
  } else {
    debug("Unknow what to run")
  }
  cache.clear()
}
function lookup(name: string): Processor {
  let using = getUsing()
  let fullname = name
  debug(`Locakup ${name}`)
  while (!(fullname in processors) && using.length) {
    fullname = `${using.pop()}.${name}`
    debug(`next ${fullname}`)
  }
  return processors[fullname]
}

function complete(cmd: string) {
  let names = getUsing().map(name => `${name}.${cmd}`.toLowerCase())
  names.push(cmd.toLowerCase())

  let aliasInfo = getAliasInfo()

  let alias = Object.keys(getAlias())
    .filter(a => a.startsWith(cmd))
    .map(alia => aliasInfo[alia])
  let pInfo = getProcessorsInfo()
  return alias.concat(
    processorNames.filter(name => {
      return names.some(i => name.toLowerCase().startsWith(i))
    })
      .map(name => {
        let info = pInfo[name] || {
          title: name,
          value: name,
          text: name
        }
        return {
          ...info,
          param: {
            action: "complete",
            processor: processors[name]
          }
        }
      })
  )
}
function lookUpIcon(cmd) {
  let aliasInfo = getAliasInfo()
  if (aliasInfo[cmd] && aliasInfo[cmd].icon) {
    return aliasInfo[cmd].icon
  }
  let processorInfo = getProcessorsInfo()

  let using = getUsing()
  let fullname = cmd
  while (!(fullname in processorInfo) && using.length) {
    fullname = `${using.pop()}.${cmd}`
    debug(`lookupIcon next ${fullname}`)
  }

  if (processorInfo[fullname] && processorInfo[fullname].icon) {
    return processorInfo[fullname].icon
  }
  return cmd
}

export async function handle(input: string): Promise<IResult[]> {
  let ret: IResult[] = []
  if (processors === null) {
    throw new Error("processors is empty,call startUp before handle")
  }
  let cmds = parse(input)
  let useCache = true
  return asyncify(cmds)
    .reduce(async (pre: any, next: IParsedCmd, idx: number) => {
      debug("Process: ", next)
      let cachedRet = cache.get(next.cmd)
      if (cachedRet && cachedRet.cmd === next.original && useCache) {
        debug("Using cache for ", next.original)
        return cachedRet.result;
      } else {
        debug("Dont use cache for ", next.cmd)
        useCache = false
      }
      let p = lookup(next.cmd)
      if (p) {
        ret = (await p(next.args || {}, pre))
          .map(item => ({
            ...item,
            icon: item.icon || lookUpIcon(next.cmd)
          }))
        // debug(`Result of ${next.cmd}`, ret)
        cache.set(next.cmd, { cmd: next.original, result: ret })
        return ret
      } else /*if (idx === cmds.length - 1)*/ {
        debug("Complete-")
        return complete(next.cmd)
      } /*else {
        debug(`No such processor:`, next.cmd)
        throw {
          type: "command-not-found",
          cmd: next.cmd
        }
      } */
    }, [])
    .map(item => ({
      ...item,
      icon: iconHelper.fixIcon(item.icon)
    }))
}
