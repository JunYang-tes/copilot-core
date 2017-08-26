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
interface IBookmark {
  title: string,
  url: string
}
class ChromeProxy {
  private srpc: {
    call<T>(method: string, ...args): Promise<T>
  }
  constructor(srpc) {
    this.srpc = srpc
  }
  public getHistory(): Promise<IHistory> {
    return this.srpc.call<IHistory>("getHistory", { text: "" })
  }
  public getTabs(): Promise<ITab> {
    return this.srpc.call<ITab>("getTabs")
  }
  public activeTab = (wid: number, tid: number) => {
    return this.srpc.call("activeTab", wid, tid)
  }
  public closeTab = (id: number) => {
    return this.srpc.call("closeTab", id)
  }
  /**
   * getCurrentTab
   */
  public getCurrentTab = (): Promise<ITab> => {
    return this.srpc.call("getCurrentTab")
  }
  public newTab = (prop) => {
    return this.srpc.call("newTab", prop)
  }
  public getBookmarks = (count): Promise<IBookmark> => {
    return this.srpc.call("getBookmarks", count)
  }
  public notify = (title, message) => {
    return this.srpc.call("notify", {
      type: "basic", title, message,
    })
  }
  public createWin = (prop) => {
    return this.srpc.call("createWin", prop)
  }
}
const urlFix = (url) => /^http/.test(url) ? url : `http://${url}`
const TIPS = "This means chrome not may running or extension may not be installed"
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
  init({ services, maxBookmarksCount }) {
    let { srpc } = services
    this.srpc = srpc
    this.chrome = new ChromeProxy(srpc)
    this.maxBookmarksCount = maxBookmarksCount || 1000
  },
  incognito(op, list) {
    let url = urlFix(op.strings.join(""))
    return [{
      title: "Open in incognito window",
      text: url,
      value: url,
      param: {
        action: "func",
        func: this.chrome.createWin,
        args: [{
          url,
          incognito: true,
          focused: true,
          state: "maximized"
        }]
      }
    }]
  },
  async history() {
    debug("call history")
    return (await this.chrome.getHistory())
      .map(h => ({
        title: h.title, text: h.url, value: h.url,
        param: {
          url: h.url
        }
      }))
  },
  async bookmarks() {
    return (await this.chrome.getBookmarks(this.maxBookmarksCount))
      .map(b => ({
        title: b.title,
        text: b.url,
        value: b.url
      }))
  },
  open(op, list) {
    return this.new(op, list)
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
  close(op, list: IResult[]) {
    let tabs = list.filter(item => !!item.param.tabId)
    return tabs.map(tab => ({
      title: "Close",
      text: tab.text,
      value: tab.value,
      param: {
        action: "func",
        func: this.chrome.closeTab,
        args: [tab.param.tabId]
      }
    }))
  },
  active(op, list: IResult[]) {
    let tabs = list.filter(item => !!item.param.tabId)
    debug(tabs)
    return tabs.map(tab => ({
      title: "Active",
      text: tab.text,
      value: tab.value,
      param: {
        action: "func",
        func: this.chrome.activeTab,
        args: [tab.param.winId, tab.param.tabId]
      }
    }))
  },
  async current() {
    return (await this.chrome.getCurrentTab()).map(tab => ({
      text: tab.title,
      value: tab.title,
      param: {
        tabId: tab.id,
        winId: tab.winId
      }
    }))
  },
  notify(op) {
    let { title, message } = op
    return [{
      title: "Send Notification",
      text: `${message || "using --message"}`,
      param: {
        action: "func",
        func: this.chrome.notify,
        args: [title, message]
      }
    }]
  },
  new(op, list: IResult[]) {
    if (list.length === 0) {
      let url = urlFix(op.strings.join(" "))
      return [{
        text: `Open ${url} in new tab`,
        param: {
          action: "func",
          func: this.chrome.newTab,
          args: [{
            url,
          }]
        }
      }]
    } else {
      return list.map(item => ({
        title: `Open ${item.title}`,
        text: `Open ${(item.param && item.param.url) || item.value} in new tab`,
        param: {
          action: "func",
          func: this.chrome.newTab,
          args: [{
            url: urlFix((item.param && item.param.url) || item.value)
          }]
        }
      }))
    }
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
        }, {
          title: "https://github.com/OuyangQianba/copilot-chrome",
          value: "https://github.com/OuyangQianba/copilot-chrome"
        }]
      }
    }
)
