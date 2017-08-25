import { decorate } from "../util"
const { debug } = require("b-logger")("copilot.chrome")
interface IHistory {
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
    return this.srpc.call<IHistory>("getHistory")
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
  tabs() {
    return [{ text: "list tabls" }]
  },
  close() {
    return [{ text: "close tabs" }]
  },
  active() {
    return [{ text: "active tab" }]
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
