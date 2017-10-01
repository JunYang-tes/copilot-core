import { load } from "./processor/index"
import { load as exLoad } from "./external"
import { IResult, Processor } from "./types"
import { parse, IParsedCmd } from "./cmd"
import { IconHelper } from "./icon"
import { search } from "./util"
import {
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

process.on("uncaughtException", (e: any) => {
  error("UncaughtException:")
  error(e)
})

export async function startUp() {
  debug("@startUp")
  let loaded = await load({})
  processors = loaded.processors
  let exProcessors = await exLoad()
  for (let p of exProcessors) {
    Object.assign(processors, p.processors)
    // Object.assign(loaded.errors)
  }
  debug("Processors:", processors)
  Object.keys(loaded.errors)
    .forEach(key => {
      warn(`Failed to load ${key}`, loaded.errors[key])
    })
  processorNames = Object.keys(processors)
}
export async function run(result: IResult) {
  if (result.param && ("action" in result.param)) {
    debug("run:", result.param)
    await action[result.param.action](result.param, result)
  } else {
    debug("Unknow what to run,fallback to copy")
    await action.copy(null, result)
  }
  cache.clear()
}
function lookup(name: string): { processor?: Processor, fullname?: string } {
  let matched = search(name, processorNames)
  if (matched.length > 0) {
    let best = matched[0]
    return {
      fullname: best.original,
      processor: processors[best.original]
    }
  } else {
    return {}
  }
}

function complete(cmd: string) {
  let names = getUsing().map(name => `${name}.${cmd}`.toLowerCase())
  names.push(cmd.toLowerCase())

  let aliasInfo = getAliasInfo()

  let alias = Object.keys(getAlias())
  let matchedAlias = search(cmd, alias)

  let pInfo = getProcessorsInfo()
  let matched = search(cmd, processorNames)

  // return alias.concat(
  return matchedAlias.map((item: any) => ({
    ...aliasInfo[item.original],
    title: item.string.replace(/``/g, "")
  })).concat(
    matched
      .map((item: any) => {
        let info = pInfo[item.original] || {
          value: item.original,
          text: item.original,
          icon: item.original
        }
        return {
          ...info,
          title: item.string.replace(/``/g, ""),
          param: {
            action: "complete",
            processor: processors[item.original]
          }
        }
      })
    )
}
function lookUpIcon(cmd: string) {
  let aliasInfo = getAliasInfo()
  if (aliasInfo[cmd] && aliasInfo[cmd].icon) {
    return aliasInfo[cmd].icon
  }
  let processorInfo = getProcessorsInfo()

  let using = getUsing()
  let fullname = cmd
  while (!(fullname in processorInfo) && using.length) {
    fullname = `${using.pop()}.${cmd}`
  }

  if (processorInfo[fullname] && processorInfo[fullname].icon) {
    return processorInfo[fullname].icon
  }
  return fullname in processorInfo ? fullname : cmd
}
function fixIResult(list: IResult[]) {
  return list.map(i => {
    if (!("value" in i)) {

    }
  })
}

export async function handle(input: string): Promise<IResult[]> {
  let ret: IResult[] = []
  if (processors === null) {
    throw new Error("processors is empty,call startUp before handle")
  }
  let cmdInfo = parse(input)
  let cmds = cmdInfo.parsed
  let useCache = cmds.length > 1 //Just use cache for piped cmd

  return asyncify(cmds)
    .reduce(async (pre: any, next: IParsedCmd, idx: number) => {
      debug("Process: ", next)
      debug(idx, "of", cmds.length - 1)
      let cachedRet = cache.get(next.cmd)
      if (cachedRet && cachedRet.cmd === next.original && useCache) {
        debug("Using cache for ", next.original)
        return cachedRet.result;
      } else {
        debug("Dont use cache for ", next.cmd)
        useCache = false
      }

      let { processor, fullname } = lookup(next.cmd)
      if (idx === cmds.length - 1 && !cmdInfo.original.lastCmdHasOpt) {
        //The last one
        let completed = complete(next.cmd)
        if (completed.length === 1) {
          debug("one matched exec it")
          next.args._original = next.original
          return processor(next.args || {}, pre)
        }
        return completed
        // return complete(cmdInfo.original.lastCmd)
      } else if (processor) {
        debug(processor.name)
        next.args._original = next.original
        ret = (await processor(next.args || {}, pre))
          .map(item => ({
            ...item,
            icon: item.icon || fullname
          }))
        debug(`Result of ${next.cmd}`, ret.slice(0, 10))
        cache.set(next.cmd, { cmd: next.original, result: ret })
        return ret
      } else {
        debug("Complete-")
        return complete(cmdInfo.original.lastCmd)
      }
    }, [])
    .map((item: IResult) => ({
      ...item,
      icon: iconHelper.fixIcon(item.icon)
    }))
}
