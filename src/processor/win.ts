import utils from "../util"
import { IResult, ICmdParam } from "../types"
export default {
  async check() {
    try {
      await utils.exec("which", "wmctrl")
      await utils.exec("which", "xdotool")
      return {
        valid: true
      }
    } catch (e) {
      return {
        valid: false,
        msg: "No wmctrl found, please install it"
      }
    }
  },
  async list() {
    let ret = await utils.exec("wmctrl", "-lp")
    return ret.split("\n")
      .map(line => line.split(/\s/))
      .map(([id, desktop, pid, machine, ...rest]) => ({
        id, desktop, pid, machine, title: rest.join(" ")
      }))
      .map((param: any) => (
        {
          title: param.title,
          text: param.title,
          value: param.title,
          type: "windows",
          param
        }))
  },
  active(op: any, list: [IResult]) {
    return list.map(item => ({
      title: item.title,
      text: `Active ${item.text}`,
      param: {
        action: "cmd",
        cmd: "xdotool",
        args: ["windowactivate", item.param.id]
      }
    }))
  },
  close(op: any, list: [IResult]) {
    return list.map(item => ({
      title: item.title,
      text: `Close ${item.text}`,
      param: {
        action: "cmd",
        cmd: "xdotool",
        args: ["windowclose", item.param.id]
      }
    }))
  },
}
