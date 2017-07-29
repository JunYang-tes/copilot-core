import { IResult } from "../types";
declare var _default: {
    path: string;
    init(): void;
    cd(op: {
        strings: string[];
    }): {
        text: string;
    }[];
    open(op: any, list: IResult[]): {
        title: string;
        value: string;
        text: string;
        param: {
            action: string;
            cmd: string;
            args: string[];
        };
    }[];
    ls(op: {
        strings: string[];
    }): Promise<{
        text: string;
        title: string;
        value: string;
    }[]>;
};
export default _default;
