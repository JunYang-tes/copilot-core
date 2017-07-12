import { IOption } from "../types";
export declare function twss(op: IOption): {
    title: string;
    text: string;
    value: string;
}[];
export declare function lucky(): ({
    title: string;
    text: string;
} | {
    title: string;
    text: string;
    value: string;
})[];
export declare function who(op: IOption): ({
    title: string;
    text: string;
} | {
    title: string;
    text: string;
    value: string;
})[] | {
    text: string;
}[];
