import { Dict, IInitParam } from "./dict"
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
  private responseHandler_: (res: any) => any
  constructor({ format, responseHandler, }: IDictParam<S>) {
    super({
      loader: {
        load: async (word: string) => {
          let fromStore = null
          try {
            fromStore = await this.store.getJson(word)
            if (fromStore) {
              fromStore = format(fromStore)
            }
          } catch (e) {
            debug(e)
          }
          if (!fromStore) {
            debug("Fetch from server")
            let ret = await this.request(word)
            if (ret) {
              this.store.setJson(word, ret)
            }
            fromStore = format(ret)
          } else {
            debug("Got it from db")
          }
          return fromStore
        }
      }
    })
    this.header = {}
    this.responseHandler_ = responseHandler || JSONResponse
  }
  public declare() {
    let declared = super.declare()
    declared.services.push("store")
    return declared
  }
  public init(params: IInitParam) {
    super.init(params)
    this.url = this.cfg.url
    this.store = params.services.store
  }
  public async request(word: string): Promise<any> {
    debug(`Fetch ${this.url.replace("{word}", querystring.escape(word))}`)
    return this.responseHandler_(
      await fetch(this.url.replace("{word}", querystring.escape(word)),
        {
          headers: this.header
        }
      )
    )
  }
}
export async function JSONResponse(res: any) {
  let ret = await res.text()
  try {
    return JSON.parse(ret)
  } catch (e) {
    debug("Res:", ret)
    debug(e)
  }
}
