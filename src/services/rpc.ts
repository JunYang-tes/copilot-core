import { IServiceParam } from "../types"
import { SocketIO, EOLWebSocket, IClient, ISocket } from "./SocketIO"
import { EventEmitter } from "events"
const { debug } = require("b-logger")("copilot.rpc")
export const TYPE = {
  SOCKETIO: "socketio",
  EOLWebSocket: "eolwebsocket"
}
export type IRPCParam = IServiceParam & {
  type: string
}
export class SingleClientServicesCall extends EventEmitter {
  protected socket: ISocket
  protected client: IClient
  private seq: number
  private calls: { [seq: number]: { res: (...args: any[]) => void, rej: (err: any) => void } }
  private timeout: number
  constructor({ namespace, type, timeout }: IServiceParam) {
    super()
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
        // arg.send(".error", "There is already a client connected")
        // arg.close()
        this.client.close()
      } else {
        this.client = arg
        this.client.onJson("response", (res: any) => {
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
          this.emit("disconnected")
          debug("disconnected")
        })
        this.emit("ready")
      }
    })
  }

  public onReady(callback: () => void) {
    this.on("ready", callback)
  }

  public onDisconnected(callback: () => void) {
    this.on("disconnected", callback)
  }

  public ready(): boolean {
    debug("ready:", !!this.client)
    return !!this.client
  }
  public call<T>(method: string, ...args: any[]): Promise<T> {
    let seq = this.seq++
    this.client.send("call", {
      method,
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
interface IRemoteCall {
  method: string,
  seq: number,
  args: any[]
}
export interface ITwoWayCallParam {
  type: string,
  namespace: string,
  provider: any
}
export class TwoWayCall extends SingleClientServicesCall {
  constructor({ type, namespace, provider }: ITwoWayCallParam) {
    super({ type, namespace })
    this.onReady(() => {
      this.client.onJson("call", async (data: IRemoteCall) => {
        if (data.method in provider) {
          try {
            let ret = await provider[data.method](...data.args)
            this.client.send("response", {
              seq: data.seq,
              ret,
            })
          } catch (e) {
            this.client.send("response", {
              seq: data.seq,
              e: e.message
            })
          }
        }
      })
    })
  }
}
