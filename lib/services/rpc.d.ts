import { IServiceParam } from "../types";
export declare class SingleClientServicesCall {
    private seq;
    private socket;
    private client;
    private calls;
    constructor({namespace}: IServiceParam);
    call<T>(method: any, ...args: any[]): Promise<T>;
}
