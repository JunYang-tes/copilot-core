import { IResult, IOption } from "../types";
export declare function head(op: {
    strings: [string];
}, list: IResult[]): IResult[];
export declare function tail(op: {
    strings: [string];
}, list: IResult[]): IResult[];
export declare function count(op: IOption, list: IResult[]): {
    title: string;
    text: number;
    value: number;
}[];
export declare function now(): {
    title: string;
    text: string;
    value: number;
}[];
export declare function toPipe(op: IOption): {
    [name: string]: any;
    strings: string[];
}[] | {
    title: string;
    text: string;
    value: string;
}[];
export declare function calc(op: IOption): {
    title: any;
    text: string;
    value: string;
    param: {
        action: string;
        field: string;
    };
}[] | {
    title: string;
    text: string;
}[];
export declare function echo(op: IOption): {
    title: string;
    text: string;
    value: string;
}[];
export declare function timeout(op: IOption, list: IResult[]): {
    title: string;
    text: string;
    value: string;
    param: {
        action: string;
        timeout: number;
        original: IResult;
    };
}[];
export declare function notify(op: IOption, list: IResult[]): {
    title: string;
    text: any;
    param: {
        action: string;
        cmd: string;
        args: any[];
    };
}[];
export declare function copy(op: IOption, list: IResult[]): {
    param: {
        action: string;
        field: string;
    };
    title?: string;
    text: string;
    value?: string;
    icon?: string;
}[];
export declare function cmd(op: IOption): {
    title: any;
    text: any;
    value: any;
    param: {
        action: string;
        cmd: any;
        args: string[];
    };
}[];
