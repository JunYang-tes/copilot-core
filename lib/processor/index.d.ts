import { Processor } from "../types";
export declare function load({dir, name}: {
    dir?: string;
    name?: ({fileName, funName}: {
        fileName: string;
        funName: string;
    }) => string;
}): Promise<{
    processors: {
        [name: string]: Processor;
    };
    errors: {
        [filename: string]: string | {
            name: string;
            msg: string;
        }[];
    };
}>;
