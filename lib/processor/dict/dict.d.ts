import { IOption, IResult } from "../../types";
export declare type format = (_: any) => IResult[];
export interface IDictParam {
    loader: (key: string) => IResult[];
}
export declare class Dict {
    protected cfg: any;
    protected store: any;
    private cache;
    private loader;
    constructor({loader}: {
        loader: any;
    });
    declare(): {
        services: string[];
        params: {
            cache: {
                loader: any;
                size: number;
            };
        };
    };
    init({cfg, services}: {
        cfg: any;
        services: any;
    }): void;
    lookup(op: IOption): Promise<any>;
}
