export type nameFn = (fileName: string, processorName: string) => string
export function prefix(p: string): nameFn {
  return (fileName, processorName) => `${p}.${fileName}.${processorName.replace("bound ", "")}`
}
