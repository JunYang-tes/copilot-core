import { decorate } from "../util"
import { IResult } from "../types"
const { debug } = require("b-logger")("copilot.chrome")
interface IHistory {
  title: string,
  url: string
}
interface ITab {
  active: boolean,
  title: string,
  url: string,
  id: number,
  winId: number
}
class ChromeProxy {
  private srpc: {
    call<T>(method: string, ...args): Promise<T>
  }
  constructor(srpc) {
    this.srpc = srpc
  }
  public getHistory(): Promise<IHistory> {
    return this.srpc.call<IHistory>("getHistory")
  }
  public getTabs(): Promise<ITab> {
    return this.srpc.call<ITab>("getTabs")
  }
  public activeTab(id: number) {
    return this.srpc.call("activeTab", id)
  }
}
const TIPS = "This means chrome not may running or extention may not be installed"
export default decorate({
  declare() {
    return {
      services: ["srpc"],
      params: {
        srpc: {
          type: "eolwebsocket"
        }
      }
    }
  },
  init({ services }) {
    let { srpc } = services
    this.srpc = srpc
    this.chrome = new ChromeProxy(srpc)
  },
  async incognito() {
    return [{ text: "new incognito tab" }]
  },
  async history() {
    debug("call history")
    return (await this.chrome.getHistory()).map(h => ({ text: h.title, value: h.title }))
  },
  bookmarks() {
    return [{ text: "list bookmarks" }]
  },
  open() {
    return [{ text: "Open link" }]
  },
  async tabs() {
    return (await this.chrome.getTabs()).map(tab => ({
      text: tab.title,
      value: tab.title,
      param: {
        tabId: tab.id,
        winId: tab.winId
      }
    }))
  },
  close() {
    return [{ text: "close tabs" }]
  },
  active(op, list: IResult[]) {
    let tabs = list.filter(item => !!item.param.tabId)
    return tabs.map(tab => ({
      title: "Active",
      text: tab.text,
      value: tab.value,
      param: {
        action: "func",
        func: this.chrome.activeTab.bind(this.chrome),
        args: [tab.param.winId, tab.param.tabId]
      }
    }))
  },
  new() {
    return [{ text: "new tab" }]
  }
}, (obj, processor) =>
    async (op, list) => {
      if (obj.srpc.ready()) {
        try {
          return await processor.call(obj, op, list)
        } catch (e) {
          if (e.message === "ETIMEOUT") {
            return [{
              title: "Failed to run",
              text: TIPS
            }]
          } else {
            debug(e)
            return []
          }
        }
      } else {
        return [{
          title: "Chrome not ready",
          text: TIPS
        }]
      }
    }
)
