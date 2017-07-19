import { Dict } from "./dict"
import { IResult, IStore } from "../../types"
const querystring = require("querystring")
const fetch = require("node-fetch")
const { debug } = require("b-logger")("copilot.net-dict")

export interface IDictParam<S> {
  format: (ret: S) => IResult[],
  responseHandler?: (ret: any) => S,
}

export class NetDict<S> extends Dict {
  protected header: any
  private url: string
  private store: IStore
  private responseHandler: (res: any) => any
  constructor({ format, responseHandler, }: IDictParam<S>) {
    super({
      loader: {
        load: async (word: string) => {
          let fromStore = null
          try {
            fromStore = await this.store.getJson(word)
          } catch (e) {
            debug(e)
          }
          if (!fromStore) {
            debug("Fetch from server")
            let ret = await this.request(word)
            debug(ret)
            fromStore = format(ret)
            this.store.setJson(word, fromStore)
          } else {
            debug("Got it from db")
          }
          return fromStore
        }
      }
    })
    this.header = {}
    this.responseHandler = responseHandler || JSONResponse
  }
  public declare() {
    let declared = super.declare()
    declared.services.push("store")
    return declared
  }
  public init(params) {
    super.init(params)
    this.url = this.cfg.url
    this.store = params.services.store
  }
  public async request(word: string): Promise<any> {
    debug(`Fetch ${this.url.replace("{word}", querystring.escape(word))}`)
    return this.responseHandler(
      await fetch(this.url.replace("{word}", querystring.escape(word))))
  }
}
export function JSONResponse(res) {
  return res.json()
}
