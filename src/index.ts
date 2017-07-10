import { load } from "./processor/index"
import { IResult, Processor } from "./types"
import { parse, IParsedCmd } from "./cmd"
import { loadConfig, getConfig, getUsing, getAlias } from "./config"
import action from "./action"
const { debug, warn, error } = require("b-logger")("copilot.main")
const { asyncify } = require("array-asyncify")

let processors: {
  [name: string]: Processor
} = null;
let processorNames: string[]

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

  let alias = Object.keys(getAlias())
    .filter(a => a.startsWith(cmd))
    .map(alia => ({
      title: alia,
      text: "Alia hint",
      value: alia
    }))

  return alias.concat(
    processorNames.filter(name => {
      return names.some(i => name.toLowerCase().startsWith(i))
    })
      .map(name => ({
        title: name,
        text: name,
        value: name,
        param: {
          action: "complete",
          processor: processors[name]
        }
      }))
  )
}

export async function handle(input: string): Promise<IResult[]> {
  let ret: IResult[] = []
  if (processors === null) {
    throw new Error("processors is empty,call startUp before handle")
  }
  let cmds = parse(input)
  return asyncify(cmds)
    .reduce(async (pre: any, next: IParsedCmd, idx: number) => {
      debug("Process: ", next)
      let p = lookup(next.cmd)
      if (p) {
        ret = await p(next.args || {}, ret)
        // debug(`Result of ${next.cmd}`, ret)
        return ret
      } else if (idx === cmds.length - 1) {
        debug("Complete-")
        return complete(next.cmd)
      } else {
        debug(`No such processor:`, next.cmd)
        throw {
          type: "command-not-found",
          cmd: next.cmd
        }
      }
    }, {})
}
