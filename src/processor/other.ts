import { IResult, IOption } from "../types"
const tws = require("twss")
tws.threshold = 0.5
export function twss(op: IOption) {
  let s = op.strings.join(" ")
  return [{
    title: `TWSS? ${s}`,
    text: `${tws.is(s)},  ${tws.probability(s)}`,
    value: `${tws.is(s)},  ${tws.probability(s)}`
  }]
}
export function lucky() {
  let days = ["昨天", "今天", "明天"]
  let animals = ["猪", "狗", "猫", "小可爱"]
  return [{
    title: "",
    text: `Yongyong ${days[(Math.random() * days.length) | 0]} 是 ${animals[(Math.random() * animals.length) | 0]}`
  }]
}
 