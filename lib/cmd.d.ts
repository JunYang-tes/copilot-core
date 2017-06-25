export interface IParsedCmd {
    cmd: string;
    original: string;
    args: any;
}
export declare function parse(cmd: string): IParsedCmd[];
