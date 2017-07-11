export class Cache<T> {
  private cache: { [key: string]: T }
  constructor() {
    this.cache = {}
  }
  public get(key) {
    return this.cache[key]
  }
  public set(key, value) {
    return this.cache[key] = value
  }
  public clear() {
    this.cache = {}
  }
}
