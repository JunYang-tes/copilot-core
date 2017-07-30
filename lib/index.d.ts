import { IResult } from "./types";
export declare function startUp(): Promise<void>;
export declare function run(result: IResult): Promise<void>;
export declare function handle(input: string): Promise<IResult[]>;
