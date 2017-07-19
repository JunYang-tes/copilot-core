import { IStore, IOption, IResult, ICache } from "../../types"
const { debug, error } = require("b-logger")("copilot.dict")
export type format = (_: any) => IResult[]
export interface IDictParam {
  loader: (key: string) => IResult[]
}
export class Dict {
  protected cfg: any
  private cache: ICache

  private loader: any
  constructor({ loader }) {
    this.loader = loader
  }
  public declare() {
    return {
      //
      services: ["cache"],
      //params to services
      params: {
        cache: {
          loader: this.loader,
          size: 100
        }
      }
    }
  }
  public init({ cfg, services }) {
    this.store = services.store
    this.cache = services.cache
    this.cfg = cfg
    debug("My services:", services)
    debug("My cfg", cfg)
  }
  public async lookup(op: IOption) {
    let word = op.strings.join(" ").trim()
    if (this.cfg.trigger && !word.endsWith(this.cfg.trigger)) {
      return [{
        text: `Look up ${word},trigger by ${this.cfg.trigger}`
      }]
    }
    if (this.cfg.trigger) {
      word = word.replace(this.cfg.trigger, "")
    }
    debug("lookup ", word)
    try {
      return (await this.cache.get(word)) || [{ title: "No result" }]
    } catch (e) {
      debug(e)
      return [{
        title: "Failed to lookup "
      }]
    }
  }
}