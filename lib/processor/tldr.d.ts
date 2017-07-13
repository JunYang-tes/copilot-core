import { IOption } from "../types";
declare var _default: {
    list(): Promise<{
        text: string;
        value: string;
    }[]>;
    show(op: IOption): Promise<any[]>;
};
export default _default;
