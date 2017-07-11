import { startUp, handle, run } from "./index"
import * as readline from "readline"
import { IResult } from "./types"
const { debug, error } = require("b-logger")("copilot.test")
// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout
// })

startUp()
  .then(() => {
    // handle("gcolor")
    //   .then((ret: IResult[]) => {
    //     debug("========", ret)
    //     if (ret.length) {
    //       run(ret[0])
    //     }
    //   })
    //   .catch(e => {
    //     console.warn(e)
    //   })

    // handle("buildin.apps.Youdao")
    //   .then((ret: IResult[]) => {
    //     debug(ret[0].param)
    //     debug(ret.length)
    //     if (ret.length) {
    //       run(ret[0])
    //     }
    //   })

    handle("buildin.process.list")
      .then((ret: IResult[]) => {
        debug(ret)
      })
    // handle("a google")
    //   .then((ret: IResult[]) => {
    //     ret.forEach(debug)
    //     // if (ret.length) {
    //     //   run(ret[0])
    //     // }
    //   })
    //   .catch(e => {
    //     error(e)
    //   })

    // rl.setPrompt(">")
    // rl.on("line", async (line: any) => {
    //   let result = await handle(line)
    //   debug("result:")
    //   result.forEach(e => {
    //     debug(e)
    //   })
    // })
  })
  .catch(e => {

  })
