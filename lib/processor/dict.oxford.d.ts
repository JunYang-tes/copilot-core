export interface IOxfordParam {
    results: [{
        id: string;
        lexicalEntries: [{
            entries: [{
                senses: [{
                    definitions: string[];
                    examples: [{
                        text: string;
                    }];
                }];
            }];
            pronunciations: [{
                phoneticSpelling: string;
            }];
        }];
    }];
    id: string;
}
declare let oxford: any;
export default oxford;
