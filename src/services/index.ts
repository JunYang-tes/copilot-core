import { Store } from "./Store"
import { Cache } from "./Cache"
import { IServiceParam } from "../types"
import { SocketIO } from "./SocketIO"
const services = {
  store: Store,
  cache: Cache,
  socketio: SocketIO
}
export function getServices(servicesName: string, serverParam: IServiceParam): any {
  return new services[servicesName](serverParam)
}
