import { IResult, ICmdParam, IOption } from "../types"
import { utils } from "../util"
const { debug } = require("b-logger")("processor.process")
export async function list() {
  let ret = await utils.exec("ps", "ux")
  return ret.split("\n")
    .map(line => line.split(/\s+/))
    .map(([user, pid, cpu, mem, vsz, rss, tty, stat, start, time, ...command]) => ({
      title: command[0],
      text: command.join(" "),
      value: command.join(" "),
      param: {
        pid,
      }
    }))
}

export function kill(op: IOption, list: IResult[]) {
  /**
   *  Name   Number  Action
   * -----------------------
   * ALRM      14   exit
   * HUP        1   exit
   * INT        2   exit
   * KILL       9   exit  this signal may not be blocked
   * PIPE      13   exit
   * POLL           exit
   * PROF           exit
   * TERM      15   exit     [Default]
   * USR1           exit
   * USR2           exit
   * VTALRM         exit
   * STKFLT         exit  may not be implemented
   * PWR            ignore    may exit on some systems
   * WINCH          ignore
   * CHLD           ignore
   * URG            ignore
   * TSTP           stop  may interact with the shell
   * TTIN           stop  may interact with the shell
   * TTOU           stop  may interact with the shell
   * STOP           stop  this signal may not be blocked
   * CONT           restart   continue if stopped, otherwise ignore
   * ABRT       6   core
   * FPE        8   core
   * ILL        4   core
   * QUIT       3   core
   * SEGV      11   core
   * TRAP       5   core
   * SYS            core  may not be implemented
   * EMT            core  may not be implemented
   * BUS            core  core dump may fail
   * XCPU           core  core dump may fail
   * XFSZ           core  core dump may fail
   * shareimprove this answer
   * edited Feb 11 '10 at 14:45
   * quack quixote
   * 32.4k1075115
   * answered Feb 11 '10 at 13:54
   */
  let signal = op.strings[0] || "INT"

  return list.map(item => ({
    title: item.title,
    text: `Kill ${item.value} (with ${signal})`,
    value: `Kill ${item.value} (with ${signal})`,
    param: {
      action: "cmd",
      cmd: "kill",
      args: ["-s", signal, item.param.pid]
    }
  }))
}
