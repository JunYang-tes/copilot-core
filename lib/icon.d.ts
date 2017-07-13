export declare class IconHelper {
    private icons;
    private iconNameRule;
    constructor(path: string[], img?: RegExp, iconNameRule?: RegExp);
    fixIcon(icon: string): string;
}
