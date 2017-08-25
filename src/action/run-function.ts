import { IFunctionParam } from "../types"
import { run } from "../index"
export async function runfunc(param: IFunctionParam) {
  await param.func(...param.args)
}
