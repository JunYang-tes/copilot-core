export interface IPrepared {
    cmd: string;
    rest: string;
}
export declare function split(cmd: string): {
    cmd: string;
    rest: string;
}[];
export declare function prepare(cmd: string): IPrepared[];
