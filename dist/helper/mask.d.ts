import { CaretString, Notation } from '../model';
export declare class Mask {
    readonly format: string;
    readonly customNotations?: ReadonlyArray<Notation>;
    private readonly initialState;
    static readonly cache: Map<string, Mask>;
    static getOrCreate(format: string, customNotations: ReadonlyArray<Notation>): Mask;
    constructor(format: string, customNotations?: ReadonlyArray<Notation>);
    apply(text: CaretString, autocomplete: boolean): Mask.Result;
    placeholder: () => string;
    acceptableTextLength(): number;
    totalTextLength(): number;
    acceptableValueLength(): number;
    totalValueLength(): number;
    private noMandatoryCharactersLeftAfterState;
    private appendPlaceholder;
}
export declare namespace Mask {
    class Result {
        readonly formattedText: CaretString;
        readonly extractedValue: string;
        readonly affinity: number;
        readonly complete: boolean;
        constructor(formattedText: CaretString, extractedValue: string, affinity: number, complete: boolean);
    }
}
