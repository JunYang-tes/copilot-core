export interface IDesktopEntry {
    name: string;
    icon: string;
}
export declare function parse(path: string): Promise<IDesktopEntry>;
