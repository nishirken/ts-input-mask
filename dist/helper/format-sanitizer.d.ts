export declare class FormatSanitizer {
    static sanitize(formatString: string): string;
    private static getFormatBlocks;
    private static divideBlocksWithMixedCharacters;
    private static sortFormatBlocks;
    private static checkOpenBraces;
}
