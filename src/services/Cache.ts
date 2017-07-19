const LRU = require("lru-cache")
export interface ILoader {
  load: (key: string) => any
}
export interface ICacheParam {
  loader: ILoader,
  size: number
}

export class Cache {
  private cache: any
  private loader: ILoader
  constructor({ loader, size }) {
    this.cache = LRU({
      max: size
    })
    this.loader = loader
  }
  public async get(key: string): Promise<any> {
    let value = this.cache.get(key)
    if (value === null || value === undefined) {
      value = await this.loader.load(key)
      if (value != null && value !== undefined) {
        this.cache.set(key, value)
      }
    }
    return value
  }
  public set(key: string, value: any) {
    this.cache.set(key, value)
  }
}
