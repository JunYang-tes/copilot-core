import { IServiceParam } from "../types";
export declare class Store {
    private namespace;
    constructor({namespace}: IServiceParam);
    get(key: string): Promise<string>;
    set(key: string, value: string): Promise<void>;
    getJson(key: string): Promise<any>;
    setJson(key: string, json: any): Promise<void>;
    private wait4init();
}
