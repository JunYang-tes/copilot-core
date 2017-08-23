export declare type Processor = (op: any, list: IResult[]) => IResult[];
export declare type Action = (_: IResult) => IResult[] | void;
export declare type Check = () => {
    valid: boolean;
    msg: string;
} | InvalidResult[];
export declare type ProcessorName = ({fileName, funName}: {
    fileName: string;
    funName: string;
}) => string;
export interface InvalidResult {
    key: string;
    msg: string;
}
export declare type IServiceParam = {
    namespace: string;
} & {
    [name: string]: any;
};
export interface IResult {
    title?: string;
    text: string;
    value?: string;
    icon?: string;
    param?: any;
}
export interface IStore {
    set(key: string): Promise<void>;
    get(key: string): Promise<string>;
    setJson(key: string, value: any): Promise<void>;
    getJson(key: string): Promise<any>;
}
export interface ICache {
    get(key: string): Promise<any>;
    set(key: string, value: any): void;
}
export interface IProcessInitParam {
    cfg: IConfig;
    services: {
        store: IStore;
    };
}
export declare type IOption = {
    strings: string[];
    "_original": string;
} & {
    [name: string]: any;
};
export declare type action = (param: IRunParam, item?: IResult) => void;
export interface IRunParam {
    name: string;
}
export declare type ICmdParam = IRunParam & {
    cmd: string;
    args: string[] | string;
};
export interface IConfig {
    alias: {
        [name: string]: string;
    };
}
export declare type ICompleteParam = IRunParam & {
    processor: Processor;
};
export declare type ITimeoutParam = IRunParam & {
    timeout: number;
    original: IResult;
};
export declare type ICopyParam = IRunParam & {
    field: string;
};
