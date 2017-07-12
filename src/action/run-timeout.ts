import { ITimeoutParam } from "../types"
import { run } from "../index"
export async function timeout(param: ITimeoutParam) {
  setTimeout(() => {
    run(param.original)
  }, param.timeout)
}
