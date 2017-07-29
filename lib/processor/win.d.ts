import { IResult } from "../types";
declare var _default: {
    filter_(list: IResult[]): IResult[];
    init(): void;
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
        value: string;
        param: {
            action: string;
            cmd: string;
            args: any[];
        };
    }[];
    close(op: any, list: [IResult]): {
        title: string;
        text: string;
        value: string;
        param: {
            action: string;
            cmd: string;
            args: any[];
        };
    }[];
    move(op: any, list: [IResult]): {
        title: string;
        text: string;
        value: string;
        param: {
            action: string;
            cmd: string;
            args: any[];
        };
    }[];
    toWorkspace(op: any, list: [IResult]): {
        title: string;
        text: string;
        value: string;
        param: {
            action: string;
            cmd: string;
            args: any[];
        };
    }[];
};
export default _default;
