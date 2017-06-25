import { IResult } from "../../types";
import { IOption } from "../../types";
export interface IConfig {
    path: string[];
    icons: string[];
    launch: string;
    icon: string;
}
declare var _default: {
    init(cfg: IConfig): Promise<void>;
    list(): any;
    launch(op: IOption, list: IResult[]): {
        title: string;
        text: string;
        value: string;
        param: {
            action: string;
            cmd: any;
            args: any[];
        };
    }[];
};
export default _default;
