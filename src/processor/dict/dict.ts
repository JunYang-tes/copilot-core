import { IStore, IOption, IResult, ICache } from "../../types"
const { debug, error } = require("b-logger")("copilot.dict")
export type format = (_: any) => IResult[]
export interface IDictParam {
  loader: {
    load: (key: string) => IResult[] | Promise<IResult[]>
  }
}
export interface IInitParam {
  cfg: {
    trigger: string
  },
  services: {
    cache: ICache,
    store: IStore
  }
}
export class Dict {
  protected cfg: any
  protected store: any
  private cache: ICache

  private loader: any
  constructor({ loader }: IDictParam) {
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
  public init({ cfg, services }: IInitParam) {
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
