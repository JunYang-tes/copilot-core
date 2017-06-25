export interface IPrepared {
    cmd: string;
    rest: string;
}
export declare function prepare(cmd: string): IPrepared[];
