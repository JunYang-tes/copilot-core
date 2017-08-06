export interface IParsedCmd {
    cmd: string;
    originalCmd: string;
    original: string;
    args: any;
}
export interface ICmdInfo {
    parsed: IParsedCmd[];
    original: {
        lastCmd: string;
        lastCmdHasOpt: boolean;
    };
}
export declare function parse(cmd: string): ICmdInfo;
