import { ICompleteParam } from "../types"
import { run } from "../index"
export async function complete(param: ICompleteParam) {
  console.log("@complete ")
  let ret = await param.processor({ strings: [] }, [])
  if (ret && ret.length) {
    await run(ret[0])
  }
}
