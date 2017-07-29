import { cmdsRequired, utils } from "../util"
import { IResult, ICmdParam } from "../types"
export default {
  filter_(list: IResult[]) {
    return list ? list.filter(i => i.param && i.param.id && /^0x[0-9a-f]/i) : []
  },
  init() {
    Object.keys(this)
      .filter(k => k !== "init" && !(/_$/.test(k)))
      .forEach(key => {
        this[key] = cmdsRequired(["wmctrl", "xdotool"], this[key])
      })
  },
  async list() {
    let ret = await utils.exec("wmctrl", "-lp")
    return ret.split("\n")
      .map(line => line.split(/\s+/))
      .map(([id, desktop, pid, machine, ...rest]) => ({
        id, desktop, pid, title: rest.join(" ")
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
      value: `Active ${item.value}`,
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
      value: `Close ${item.value}`,
      param: {
        action: "cmd",
        cmd: "xdotool",
        args: ["windowclose", item.param.id]
      }
    }))
  },
  move(op: any, list: [IResult]) {
    let [x, y] = [0, 0]
    if ("x" in op && "y" in op) {
      [x, y] = [+op.x, +op.y]
    } else if (op.strings.length === 2) {
      [x, y] = op.strings
    }

    return list.map(item => ({
      title: item.title,
      text: `Move to (${x},${y})`,
      value: `Move to (${x},${y})`,
      param: {
        action: "cmd",
        cmd: "xdotool",
        args: ["windowmove", item.param.id, x, y]
      }
    }))
  },
  toWorkspace(op: any, list: [IResult]) {
    //TODO:default by name
    let wsIdx = 0;
    let wsName = "TODO";
    return list.map(item => ({
      title: item.title,
      text: `Move window to workspace ${wsName}`,
      value: `Move window to workspace ${wsName}`,
      param: {
        action: "cmd",
        cmd: "xdotool",
        args: ["set_desktop_for_window", item.param.id, wsIdx]
      }
    }))
  }
}
