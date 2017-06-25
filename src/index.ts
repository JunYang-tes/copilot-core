import { load } from "./processor/index"
import { IResult, Processor } from "./types"
import { parse, IParsedCmd } from "./cmd"
import { loadConfig, getConfig, getUsing } from "./config"
import action from "./action"
const { debug, warn, error } = require("b-logger")("copilot.main")
const { asyncify } = require("array-asyncify")

let processors: {
  [name: string]: Processor
} = null;

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
}
export function run(result: IResult) {
  if (result.param && ("action" in result.param)) {
    debug(action)
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

export async function handle(input: string): Promise<IResult[]> {
  let ret: IResult[] = []
  if (processors === null) {
    throw new Error("processors is empty,call startUp before handle")
  }
  let cmds = parse(input)
  return asyncify(cmds)
    .reduce(async (pre: any, next: IParsedCmd, idx: number) => {
      debug("Exec: ", next)
      let p = lookup(next.cmd)
      if (p) {
        ret = await p(next.args || {}, ret)
        debug(`Result of ${next.cmd}`, ret)
        return ret
      } else if (idx !== cmds.length - 1) {
        debug(`No such processor:`, next.cmd)
        throw {
          type: "command-not-found",
          cmd: next.cmd
        }
      } else {
        return []
      }
    }, {})
}
