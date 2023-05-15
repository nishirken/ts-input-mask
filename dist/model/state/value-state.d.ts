import { State } from '../state';
import { Next } from '../next';
import '../../util/string';
export declare class ValueState extends State {
    readonly child: State | null;
    readonly type: ValueState.StateType;
    readonly isElliptical: boolean;
    constructor(child: State | null, type: ValueState.StateType);
    accept(character: string): Next | null;
    nextState(): State | never;
    toString(): string;
    private accepts;
}
export declare namespace ValueState {
    class StateType {
    }
    class Literal extends StateType {
    }
    class Numeric extends StateType {
    }
    class AlphaNumeric extends StateType {
    }
    class Ellipsis extends StateType {
        readonly inheritedType: StateType;
        constructor(inheritedType: StateType);
    }
    class Custom extends StateType {
        readonly character: string;
        readonly characterSet: string[];
        constructor(character: string, characterSet: string[]);
    }
}
