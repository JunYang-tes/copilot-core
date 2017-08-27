import { IResult, IOption } from "../types"
const { debug } = require("b-logger")("copilot.processor.filter")

export function grep(op: IOption, list: IResult[]): IResult[] {
  let flags = ""
  let field = op.field || "value"
  if (op.i) {
    flags = "i"
  }

  debug("grep ", op)
  debug(op.strings.join("-"))
  const test: RegExp = new RegExp(op.strings.join(" "), flags)
  debug(test)
  return list.filter((item) => {
    // debug(item.value, test.test(item.value))
    return test.test(item.value)
  })
}
const Fuse = require("fuse.js")
export function search(op: IOption, list: IResult[]) {
  let keys = ["value"]
  if (op.keys && Array.isArray(op.keys)) {
    keys = op.keys
  }
  const options = {
    shouldSort: true,
    includeScore: true,
    includeMatches: true,
    threshold: 0.6,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys,
  };
  const fuse = new Fuse(list, options);
  debug("search ", op.strings.join(" "))
  if (op.strings.length === 0) {
    return list
  }
  let result = fuse.search(op.strings.join(" "));
  return result.map(ret => {
    for (let match of ret.matches) {
      let key = match.key
      let orignal = ret.item[key]
      if (key === "value") {
        ret.item.text = format(orignal, match.indices)
      }
    }
    /**
     *  "matches": [
     * {
     *   "indices": [[4,5],[13,15] ],
     *   "key": "title"
     * },
     * {
     *   "indices": [],
     *   "key": "author.firstName"
     * }
     * ]
     */
    return ret.item
  })
}
function escape(input) {
  //TODO: escape
  return input
}
function format(input: string, positions: Array<[number, number]>) {
  let result: string[] = []
  let last = 0;
  for (let [start, end] of positions) {
    if (last !== start) {
      result.push(escape(input.slice(last, start)))
    }
    result.push(`\`${escape(input.slice(start, end + 1))}\``)
    last = end + 1
  }
  if (last !== input.length) {
    result.push(escape(input.substring(last)))
  }
  return result.join("")
}
