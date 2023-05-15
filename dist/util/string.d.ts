export {};
declare global {
    interface String {
        isDigit(): boolean;
        isLetter(): boolean;
        isLetterOrDigit(): boolean;
        contains(char: string): boolean;
        isEmpty(): boolean;
        first(): string;
        toCharArray(): string[];
        prefixIntersection(another: string): string;
    }
}
