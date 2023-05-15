import { CaretString } from '../model';
export declare class CaretStringIterator {
    private readonly caretString;
    private currentIndex;
    constructor(caretString: CaretString, currentIndex?: number);
    beforeCaret(): boolean;
    next(): string | null;
}
