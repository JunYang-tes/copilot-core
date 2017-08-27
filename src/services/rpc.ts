import { IServiceParam } from "../types"
import { SocketIO, EOLWebSocket, IClient, ISocket } from "./SocketIO"
const { debug } = require("b-logger")("copilot.rpc")
const TYPE = {
  SOCKETIO: "socketio",
  EOLWebSocket: "eolwebsocket"
}
export type IRPCParam = IServiceParam & {
  type: string
}
export class SingleClientServicesCall {
  private seq: number
  private socket: ISocket
  private client: IClient
  private calls: { [seq: number]: { res: (...args) => void, rej: (err) => void } }
  private timeout: number
  constructor({ namespace, type, timeout }: IServiceParam) {
    this.seq = 0
    this.calls = {}
    this.timeout = +timeout || 1000
    if (type === TYPE.SOCKETIO) {
      this.socket = new SocketIO({ namespace })
    } else if (type === TYPE.EOLWebSocket) {
      this.socket = new EOLWebSocket({ namespace })
    }
    this.socket.on<IClient>("connection", (arg: IClient) => {
      debug("Client connected")
      if (this.client) {
        arg.send(".error", "There is already a client connected")
        arg.close()
      } else {
        this.client = arg
        this.client.onJson(".response", (res: any) => {
          if ("seq" in res) {
            let handler = this.calls[+res.seq]
            if (res.result) {
              handler.res(res.result)
            } else if (res.error) {
              handler.rej(res.error)
            } else {
              handler.res()
            }
            delete this.calls[+res.seq]
          }
        })
        this.client.on("close", () => {
          this.client = null
          debug("disconnected")
        })
      }
    })
  }
  public ready(): boolean {
    debug("ready:", !!this.client)
    return !!this.client
  }
  public call<T>(method, ...args): Promise<T> {
    let seq = this.seq++
    this.client.send(method, {
      seq,
      args
    })
    return new Promise((res, rej) => {
      let clr = setTimeout(() => {
        delete this.calls[seq]
        rej(new Error("ETIMEOUT"))
      }, this.timeout);
      this.calls[seq] = {
        res: (ret) => {
          clearTimeout(clr)
          res(ret)
        },
        rej
      }
    })
  }
}
