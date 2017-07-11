import { IResult, IOption } from "../types";
export declare function list(): Promise<{
    title: string;
    text: string;
    value: string;
    param: {
        pid: string;
    };
}[]>;
export declare function kill(op: IOption, list: IResult[]): {
    title: string;
    text: string;
    value: string;
    param: {
        action: string;
        cmd: string;
        args: any[];
    };
}[];
