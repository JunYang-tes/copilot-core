export declare type nameFn = ({fileName, funName}: {
    fileName: string;
    funName: string;
}) => string;
export declare function prefix(p: string): nameFn;
