import { IResult, IOption } from "../types";
export declare function grep(op: {
    strings: [string];
}, list: IResult[]): IResult[];
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
};
