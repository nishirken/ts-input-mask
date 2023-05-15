import { State } from '../state';
import { Next } from '../next';
import '../../util/string';
export declare class OptionalValueState extends State {
    readonly child: State;
    readonly type: OptionalValueState.StateType;
    constructor(child: State, type: OptionalValueState.StateType);
    accept(character: string): Next | null;
    toString(): string;
    private accepts;
}
export declare namespace OptionalValueState {
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
