import { NetDict } from "./dict/net-dict";
export interface IcibaItem {
    word_name: string;
    is_CRI: number;
    exchange?: {
        word_pl?: string;
        word_past?: string;
        word_done?: string;
        word_ing?: string;
        word_third?: string;
        word_er?: string;
        word_est?: string;
    };
    symbols: [{
        ph_en: string;
        ph_am: string;
        parts: [{
            part: string;
            means: string[];
        }];
    }];
    ph_en?: string;
    ph_am?: string;
}
declare let iciba: NetDict<IcibaItem>;
export default iciba;
