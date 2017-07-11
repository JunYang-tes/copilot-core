export declare class Cache<T> {
    private cache;
    constructor();
    get(key: any): T;
    set(key: any, value: any): any;
    clear(): void;
}
