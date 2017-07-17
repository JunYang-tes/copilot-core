import { Store } from "./Store"
import { Cache } from "./Cache"
import { IServiceParam } from "../types"
const services = {
  store: Store,
  cache: Cache
}
export function getServices(servicesName: string, serverParam: IServiceParam): any {
  return new services[servicesName](serverParam)
}
