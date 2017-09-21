import { NetDict } from "./dict/net-dict"
const { debug } = require("b-logger")("copilot.dict.oxford")
export interface ISenses {
  definitions: string[],
  examples?: [{ text: string }],
  subsenses?: ISenses[],
}

export interface IOxfordParam {
  results: [{
    id: string,
    language: string,
    lexicalEntries: [{
      entries: [
        {
          etymologies: string[],
          homographNumber: string,
          senses: ISenses[],
          variantForms: [{ text: string }]
        }
      ],
      pronunciations: [{
        dialects: string[],
        phoneticSpelling: string
      }]
    }]
  }]
  id: string,
}
class Oxford extends NetDict<IOxfordParam> {
  constructor() {
    super({
      format: (ret) => {
        let list = []
        for (let result of ret.results) {
          for (let lex of result.lexicalEntries) {
            let p = lex.pronunciations
              .map(e => `${e.dialects.join(" ")}[${e.phoneticSpelling}]`)
              .join(";")
            list.push({
              title: ret.id,
              text: p,
              value: p
            })
            for (let entry of lex.entries) {
              let sense = entry.senses
              while (sense.length) {
                let s = sense.shift()
                if (s.subsenses) {
                  sense.push(...s.subsenses)
                }
                list.push(...s.definitions.map(d => ({
                  text: `[Definition]${d}`
                })))
                if (s.examples) {
                  list.push(...s.examples.map(e => ({
                    text: `[example]${e.text}`
                  })))
                }
              }
            }
          }
        }
        return list
      }
    })
  }
  public init(param: any) {
    super.init(param)
    this.header = {
      Accept: "application/json",
      app_id: this.cfg.id,
      app_key: this.cfg.key
    }
  }
}

let oxford: any = new Oxford()
oxford.default = oxford.lookup

export default oxford

/*
{
  "metadata": {
    "provider": "Oxford University Press"
  },
  "results": [
    {
      "id": "hello",
      "language": "en",
      "lexicalEntries": [
        {
          "entries": [
            {
              "etymologies": [
                "early 19th century: variant of earlier hollo; related to holla"
              ],
              "homographNumber": "000",
              "senses": [
                {
                  "definitions": [
                    "used as a greeting or to begin a telephone conversation"
                  ],
                  "examples": [
                    {
                      "text": "hello there, Katie!"
                    }
                  ],
                  "id": "m_en_gbus0460730.012",
                  "subsenses": [
                    {
                      "definitions": [
                        "used to express surprise"
                      ],
                      "examples": [
                        {
                          "text": "hello, what's all this then?"
                        }
                      ],
                      "id": "m_en_gbus0460730.017",
                      "regions": [
                        "British"
                      ]
                    },
                    {
                      "definitions": [
                        "used as a cry to attract someone's attention"
                      ],
                      "examples": [
                        {
                          "text": "‘Hello below!’ he cried"
                        }
                      ],
                      "id": "m_en_gbus0460730.018"
                    },
                    {
                      "definitions": [
                        "used informally to express sarcasm or anger"
                      ],
                      "examples": [
                        {
                          "text": "Hello! Did you even get what the play was about?"
                        }
                      ],
                      "id": "m_en_gbus0460730.019"
                    }
                  ]
                }
              ],
              "variantForms": [
                {
                  "text": "hallo"
                },
                {
                  "text": "hullo"
                }
              ]
            }
          ],
          "language": "en",
          "lexicalCategory": "Interjection",
          "pronunciations": [
            {
              "audioFile": "http://audio.oxforddictionaries.com/en/mp3/hello_gb_1.mp3",
              "dialects": [
                "British English"
              ],
              "phoneticNotation": "IPA",
              "phoneticSpelling": "həˈləʊ"
            },
            {
              "dialects": [
                "British English"
              ],
              "phoneticNotation": "IPA",
              "phoneticSpelling": "hɛˈləʊ"
            }
          ],
          "text": "hello"
        },
        {
          "entries": [
            {
              "grammaticalFeatures": [
                {
                  "text": "Singular",
                  "type": "Number"
                }
              ],
              "homographNumber": "001",
              "senses": [
                {
                  "definitions": [
                    "an utterance of ‘hello’; a greeting"
                  ],
                  "examples": [
                    {
                      "text": "she was getting polite nods and hellos from people"
                    }
                  ],
                  "id": "m_en_gbus0460730.025"
                }
              ],
              "variantForms": [
                {
                  "text": "hullo"
                },
                {
                  "text": "hallo"
                }
              ]
            }
          ],
          "language": "en",
          "lexicalCategory": "Noun",
          "pronunciations": [
            {
              "audioFile": "http://audio.oxforddictionaries.com/en/mp3/hello_gb_1.mp3",
              "dialects": [
                "British English"
              ],
              "phoneticNotation": "IPA",
              "phoneticSpelling": "həˈləʊ"
            },
            {
              "dialects": [
                "British English"
              ],
              "phoneticNotation": "IPA",
              "phoneticSpelling": "hɛˈləʊ"
            }
          ],
          "text": "hello"
        },
        {
          "entries": [
            {
              "grammaticalFeatures": [
                {
                  "text": "Intransitive",
                  "type": "Subcategorization"
                },
                {
                  "text": "Present",
                  "type": "Tense"
                }
              ],
              "homographNumber": "002",
              "senses": [
                {
                  "definitions": [
                    "say or shout ‘hello’"
                  ],
                  "examples": [
                    {
                      "text": "I pressed the phone button and helloed"
                    }
                  ],
                  "id": "m_en_gbus0460730.034"
                }
              ],
              "variantForms": [
                {
                  "text": "hallo"
                },
                {
                  "text": "hullo"
                }
              ]
            }
          ],
          "language": "en",
          "lexicalCategory": "Verb",
          "pronunciations": [
            {
              "audioFile": "http://audio.oxforddictionaries.com/en/mp3/hello_gb_1.mp3",
              "dialects": [
                "British English"
              ],
              "phoneticNotation": "IPA",
              "phoneticSpelling": "həˈləʊ"
            },
            {
              "dialects": [
                "British English"
              ],
              "phoneticNotation": "IPA",
              "phoneticSpelling": "hɛˈləʊ"
            }
          ],
          "text": "hello"
        }
      ],
      "type": "headword",
      "word": "hello"
    }
  ]
}
*/
