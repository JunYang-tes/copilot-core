import { Store } from "./Store"
import { Cache } from "./Cache"
import { IServiceParam } from "../types"
import { SocketIO, EOLWebSocket } from "./SocketIO"
import { SingleClientServicesCall, TwoWayCall } from "./rpc"
const { warn } = require("b-logger")("copilot.servcies")
const services = {
  store: Store,
  cache: Cache,
  socketio: SocketIO,
  websocket: EOLWebSocket,
  twoWayCall: TwoWayCall,
  srpc: SingleClientServicesCall
}
export function getServices(servicesName: string, serverParam: IServiceParam): any {
  if (!serverParam) {
    warn("No services param")
  }
  return new services[servicesName](serverParam)
}
