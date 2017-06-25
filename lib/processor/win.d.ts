import { IResult } from "../types";
declare var _default: {
    check(): Promise<{
        valid: boolean;
    }>;
    list(): Promise<{
        title: any;
        text: any;
        value: any;
        type: string;
        param: any;
    }[]>;
    active(op: any, list: [IResult]): {
        title: string;
        text: string;
        param: {
            action: string;
            cmd: string;
            args: any[];
        };
    }[];
    close(op: any, list: [IResult]): {
        title: string;
        text: string;
        param: {
            action: string;
            cmd: string;
            args: any[];
        };
    }[];
};
export default _default;
