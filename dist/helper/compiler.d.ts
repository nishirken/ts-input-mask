import { Notation, State } from '../model';
export declare class Compiler {
    private customNotations;
    constructor(customNotations: ReadonlyArray<Notation>);
    compile(formatString: string): State | never;
    private _compile;
    private determineInheritedType;
    private compileWithCustomNotations;
    private determineTypeWithCustomNotation;
}
