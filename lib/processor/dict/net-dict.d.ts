import { Dict } from "./dict";
import { IResult } from "../../types";
export interface IDictParam<S> {
    format: (ret: S) => IResult[];
    responseHandler?: (ret: any) => S;
}
export declare class NetDict<S> extends Dict {
    protected header: any;
    private url;
    private store;
    private responseHandler_;
    constructor({format, responseHandler}: IDictParam<S>);
    declare(): {
        services: string[];
        params: {
            cache: {
                loader: any;
                size: number;
            };
        };
    };
    init(params: any): void;
    request(word: string): Promise<any>;
}
export declare function JSONResponse(res: any): Promise<any>;
