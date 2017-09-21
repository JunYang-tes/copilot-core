export class Cache<T> {
  private cache: { [key: string]: T }
  constructor() {
    this.cache = {}
  }
  public get(key: string) {
    return this.cache[key]
  }
  public set(key: string, value: T) {
    return this.cache[key] = value
  }
  public clear() {
    this.cache = {}
  }
}
