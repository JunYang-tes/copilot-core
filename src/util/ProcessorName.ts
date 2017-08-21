export type nameFn = ({
  fileName,
  funName }: { fileName: string, funName: string }) => string
export function prefix(p: string): nameFn {
  return ({ fileName, funName }) => `${p}.${fileName}.${funName.replace("bound ", "")}`
}
