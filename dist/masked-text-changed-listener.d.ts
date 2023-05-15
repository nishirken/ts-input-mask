import { Notation } from './model';
import { AffinityCalculation } from './helper/affinity-calculation-strategy';
import { Mask } from './helper/mask';
declare type FieldELement = HTMLInputElement | HTMLTextAreaElement;
export declare class MaskedTextChangedListener {
    protected readonly primaryFormat: string;
    private field;
    protected readonly listener?: MaskedTextChangedListener.ValueListener;
    protected readonly affineFormats: ReadonlyArray<string>;
    protected readonly customNotations: ReadonlyArray<Notation>;
    protected readonly affinityCalculationStrategy: AffinityCalculation;
    protected readonly autocomplete: boolean;
    private readonly primaryMask;
    private afterText;
    private caretPosition;
    constructor(primaryFormat: string, field: FieldELement, listener?: MaskedTextChangedListener.ValueListener, affineFormats?: ReadonlyArray<string>, customNotations?: ReadonlyArray<Notation>, affinityCalculationStrategy?: AffinityCalculation, autocomplete?: boolean);
    static installOn(primaryFormat: string, field: FieldELement, listener?: MaskedTextChangedListener.ValueListener, affineFormats?: ReadonlyArray<string>, customNotations?: ReadonlyArray<Notation>, affinityCalculationStrategy?: AffinityCalculation, autocomplete?: boolean): MaskedTextChangedListener;
    placeholder: () => string;
    acceptableTextLength: () => number;
    totalTextLength: () => number;
    totalValueLength: () => number;
    setText(text: string): Mask.Result | null;
    dispose: () => void;
    private _setText;
    private pickMask;
    private calculateAffinity;
    private addEvents;
    private handleInputChange;
    private handleFocus;
    private handleBlur;
    private onFocusChange;
    private onTextChanged;
}
export declare namespace MaskedTextChangedListener {
    class ValueListener {
        onTextChanged(maskFilled: boolean, extractedValue: string, formattedValue: string): any;
    }
}
export {};
