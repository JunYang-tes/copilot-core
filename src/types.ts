export type Processor = (op: any, list: IResult[]) => IResult[]
export type Action = (_: IResult) => IResult[] | void;
export type Check = () => { valid: boolean, msg: string } | InvalidResult[]
export type ProcessorName = ({ fileName, funName }: { fileName: string, funName: string }) => string
export interface InvalidResult {
  key: string,
  msg: string
}
export interface IResult {
  //formatted title to show
  title: string,
  //formatted text to show
  text: string,
  //value of Result
  value: string,
  icon?: string,
  // action: string | Action,
  // type: string,
  param?: any
}
export type IOption = {
  strings: string[]
} & {
    [name: string]: any
  }
export type action = (param: IRunParam) => void
export interface IRunParam {
  name: string
}
export type ICmdParam = IRunParam & {
  cmd: string
  args: string[] | string
}
export interface IConfig {
  alias: { [name: string]: string }
}
export type ICompleteParam = IRunParam & {
  processor: Processor
}
export type ITimeoutParam = IRunParam & {
  timeout: number,
  original: IResult
}
