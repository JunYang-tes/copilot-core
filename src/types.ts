export type Processor = (op: any, list: IResult[]) => IResult[]
export type Action = (_: IResult) => IResult[] | void;
export type Check = () => { valid: boolean, msg: string } | InvalidResult[]
export type ProcessorName = ({ fileName, funName }: { fileName: string, funName: string }) => string
export interface InvalidResult {
  key: string,
  msg: string
}
export type IServiceParam = {
  namespace: string
} & { [name: string]: any }
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
export interface IStore {
  set(key: string): Promise<void>,
  get(key: string): Promise<string>,
  setJson(key: string, value: any): Promise<void>,
  getJson(key: string): Promise<any>
}
export interface ICache {
  get(key: string): Promise<any>
  set(key: string, value: any): void
}

export interface IProcessInitParam {
  cfg: IConfig,
  services: {
    store: IStore
  }
}
export type IOption = {
  strings: string[]
} & {
    [name: string]: any
  }
export type action = (param: IRunParam, item?: IResult) => void
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
export type ICopyParam = IRunParam & {
  field: string
}
