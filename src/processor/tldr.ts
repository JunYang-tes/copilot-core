import { IOption, IResult, ICmdParam } from "../types"
import tldr = require("tldr/lib/index")
import platform = require("tldr/lib/platform")
import cache = require("tldr/lib/cache")
const { debug } = require("b-logger")("copilor.processors.tldr")
const commandsFor = (os) => new Promise<string[]>((res, rej) => {
  tldr.commandsFor(os, res);
})
const getPage = (cmd) => new Promise<string[]>((res, rej) => {
  cache.getPage(cmd, (err, content) => {
    if (err) {
      rej(err)
    } else {
      res((content || "").split("\n"))
    }
  })
})

export default {
  async list() {
    let os = platform.getPreferredPlatformFolder();
    let commands = await commandsFor(os);
    return commands.map(cmd => ({
      text: cmd,
      value: cmd
    }))
  },
  async show(op: IOption) {
    let cmd = op.strings.join()
    if (cmd && cmd.endsWith("$")) {
      cmd = cmd.slice(0, -1)
      try {
        let content = (await getPage(cmd)).filter(i => i.trim().length)
        let text = ""
        let item: any = {
          title: "",
          text: ""
        }
        let ret = []
        for (let line of content) {
          if (line.trim().startsWith("-")) {
            item.value = item.text
            ret.push(item)
            item = {
              title: line,
              text: ""
            }
          } else {
            item.text += line
          }
        }
        ret.push(item)
        return ret
      } catch (e) {
        debug(e)
        cache.update()
        return [{
          title: "tldr",
          text: "No entry,updating..."
        }]
      }
    }
    return [{
      text: "Show short usage ,trigger by $"
    }]
  }
}
