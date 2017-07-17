export interface ILoader {
    load: (key: string) => any;
}
export interface ICacheParam {
    loader: ILoader;
    size: number;
}
export declare class Cache {
    private cache;
    private loader;
    constructor({loader, size}: {
        loader: any;
        size: any;
    });
    get(key: string): Promise<any>;
    set(key: string, value: any): void;
}
