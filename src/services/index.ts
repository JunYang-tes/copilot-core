import { Store } from "./Store"
import { Cache } from "./Cache"
import { IServiceParam } from "../types"
import { SocketIO, EOLWebSocket } from "./SocketIO"
import { SingleClientServicesCall } from "./rpc"
const services = {
  store: Store,
  cache: Cache,
  socketio: SocketIO,
  websocket: EOLWebSocket,
  srpc: SingleClientServicesCall
}
export function getServices(servicesName: string, serverParam: IServiceParam): any {
  return new services[servicesName](serverParam)
}
