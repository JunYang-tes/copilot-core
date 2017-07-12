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
    text: `雍雍${days[(Math.random() * days.length) | 0]}是${animals[(Math.random() * animals.length) | 0]}`
  }, {
    title: "",
    text: "广告位招租",
    value: "It's a joke",
  }]
}

export function who(op: IOption) {
  let who = op.who || ["雍雍", "雍雍", "雍雍", "雍雍", "GG"]
  let something = op.something || ["洗碗"]
  if (op.t) {
    return [{
      title: "",
      text: `今天${who[(Math.random() * who.length) | 0]}${something}`
    }, {
      title: "",
      text: "广告位招租",
      value: "It's a joke",
    }]
  } else {
    return [{
      text: "Who will go to do ? trigger by -t"
    }]
  }
}
