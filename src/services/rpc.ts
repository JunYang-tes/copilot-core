import { IServiceParam } from "../types"
import { SocketIO, IClient } from "./SocketIO"
export class SingleClientServicesCall {
  private seq: number
  private socket: SocketIO
  private client: IClient
  private calls: { [seq: number]: { res: (...args) => void, rej: (err) => void } }
  constructor({ namespace }: IServiceParam) {
    this.socket = new SocketIO({ namespace })
    this.socket.on<IClient>("connection", (arg) => {
      if (this.client) {
        arg.send(".error", "There is already a client connected")
      } else {
        this.client = arg
        this.client.onJson(".response", (res: any) => {
          if ("seq" in res) {
            let handler = this.calls[+res.seq]
            if (res.result) {
              handler.res(...res.result)
            } else {
              handler.rej(new Error(res.error || "Unknow"))
              delete this.calls[+res.seq]
            }
          }
        })
      }
    })
  }
  public call<T>(method, ...args): Promise<T> {
    this.client.send(method, {
      seq: this.seq++,
      args
    })
    return new Promise<T>((res, rej) => {
      this.calls[this.seq - 1] = {
        res,
        rej
      }
    })
  }
}
