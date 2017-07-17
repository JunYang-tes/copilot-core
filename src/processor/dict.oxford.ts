import { Dict } from "./dict/dict"
let oxford: any = new Dict()
oxford.default = function tr() {
  return [{
    title: "Oxford dictory"
  }]
}

export default oxford
