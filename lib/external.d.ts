import { Processor } from "./types";
export interface IProcessors {
    processors: {
        [name: string]: Processor;
    };
    error: any;
}
export declare function load(): Promise<IProcessors[]>;
