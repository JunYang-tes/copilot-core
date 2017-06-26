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
        text: string;
        param: {
            action: string;
            cmd: any;
            args: any[];
        };
        title: string;
        value: string;
        icon?: string;
    }[];
};
export default _default;
