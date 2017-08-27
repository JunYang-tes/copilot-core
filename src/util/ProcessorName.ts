export type nameFn = (fileName: string, processorName: string) => string
export function prefix(p: string): nameFn {
  return (fileName, processorName) => {
    if (p.endsWith(fileName)) {
      //For some/foo/foo.js => some.foo.[processorName] or some.foo.foo.[processorName]
      return `${p}.${processorName.replace("bound ", "")}`
    } else {
      return `${p}.${fileName}.${processorName.replace("bound ", "")}`
    }
  }
}
