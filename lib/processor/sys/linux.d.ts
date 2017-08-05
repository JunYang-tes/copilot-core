import { IOption } from "../../types";
export declare function suspend(): {
    title: string;
    text: string;
    value: string;
    param: {
        action: string;
        cmd: string;
        args: string[];
    };
}[];
export declare function reboot(): {
    title: string;
    text: string;
    value: string;
    param: {
        action: string;
        cmd: string;
        args: string[];
    };
}[];
export declare function xkill(): {
    title: string;
    param: {
        action: string;
        cmd: string;
    };
}[];
export declare function mute(): {
    title: string;
    text: string;
}[];
export declare const wifi: (...args: any[]) => any;
export declare const ip: (...args: any[]) => any;
export declare function bc(opt: IOption): Promise<{
    text: string;
}[]>;
