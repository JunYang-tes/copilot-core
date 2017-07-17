import { IStore, IOption, IResult, ICache } from "../../types"
const { debug } = require("b-logger")("copilot.dict")
export class Dict {
  private cache: ICache
  private store: IStore
  private loader: any
  public declare() {
    return {
      //
      services: ["store", "cache"],
      //params to services
      params: {
        cache: {
          loader: this.loader,
          size: 100
        }
      }
    }
  }
  public init({ services }) {
    this.store = services.store
    this.cache = services.cache
    debug("My services:", services)
  }
  public lookup(op: IOption) {
    let word = op.strings.join(" ")

  }
}
