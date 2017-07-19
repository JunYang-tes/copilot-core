export interface ISenses {
    definitions: string[];
    examples: [{
        text: string;
    }];
    subsenses?: ISenses[];
}
export interface IOxfordParam {
    results: [{
        id: string;
        language: string;
        lexicalEntries: [{
            entries: [{
                etymologies: string[];
                homographNumber: string;
                senses: ISenses[];
                variantForms: [{
                    text: string;
                }];
            }];
            pronunciations: [{
                dialects: string[];
                phoneticSpelling: string;
            }];
        }];
    }];
    id: string;
}
declare let oxford: any;
export default oxford;
