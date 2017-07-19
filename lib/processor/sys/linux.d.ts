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
export declare function ip(): void;
export declare function wifiOff(): void;
export declare function wifiOn(): void;
