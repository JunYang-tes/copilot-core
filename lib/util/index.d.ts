/// <reference types="node" />
import * as fs from "fs";
declare const helper: {
    path: (str: string) => string;
    exec: (command: string, args: any, options?: {}) => Promise<string>;
    sh: (command: string, args: any) => Promise<string>;
    promisify: (api: Function) => (...param: any[]) => Promise<any>;
};
export declare const stat: (path: string | Buffer) => Promise<fs.Stats>;
export declare const readdir: (path: string | Buffer) => Promise<string[]>;
export declare const readFile: (path: string, encoding: string) => Promise<string>;
export default helper;
export declare const utils: {
    path: (str: string) => string;
    exec: (command: string, args: any, options?: {}) => Promise<string>;
    sh: (command: string, args: any) => Promise<string>;
    promisify: (api: Function) => (...param: any[]) => Promise<any>;
};
export declare function cmdsRequired(cmds: string[], fn: any, errors?: string[]): (...args: any[]) => any;
