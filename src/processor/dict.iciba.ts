import { NetDict } from "./dict/net-dict"
export interface IcibaItem {
  word_name: string,
  is_CRI: number,
  exchange?: {
    word_pl?: string,
    word_past?: string,
    word_done?: string,
    word_ing?: string,
    word_third?: string,
    word_er?: string,
    word_est?: string
  },
  symbols: [{
    ph_en: string,
    ph_am: string,
    parts: [
      {
        part: string,
        means: string[]
      }
    ]
  }],
  ph_en?: string,
  ph_am?: string
}
interface IChineseSymbol {
  word_symbol: string,
  parts: IChineseParts[]
}
interface IChineseParts {
  part_name: string,
  means: [{
    word_mean: string,
  }]
}

let iciba = new NetDict<IcibaItem>({
  format: (ret) => {
    if (ret.is_CRI) {
      let symbol = ret.symbols
      let ph = symbol.map(item => `[${item.ph_en}],[${item.ph_am}]`).join(";")
      let means = symbol[0].parts
        .map(p => {
          let mean = `${p.part},${p.means.join(" ")}`
          return {
            text: mean,
            value: mean
          }
        })
      return [{
        title: ret.word_name,
        text: ph,
        value: ph
      }, ...means]
    } else {
      let symbols: IChineseSymbol[] = ret.symbols as any;
      let list = []
      for (let sym of symbols) {
        list.push({
          title: ret.word_name,
          text: sym.word_symbol,
          value: sym.word_symbol
        })
        for (let p of sym.parts) {
          list.push(...p.means.map(m => ({ text: m.word_mean, value: m.word_mean })))
        }
      }
      return list
    }
  }
})
  ; (iciba as any).default = iciba.lookup

export default iciba
