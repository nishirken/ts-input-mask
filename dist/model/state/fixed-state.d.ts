import { State } from '../state';
import { Next } from '../next';
export declare class FixedState extends State {
    readonly child: State;
    readonly ownCharacter: string;
    constructor(child: State, ownCharacter: string);
    accept(character: string): Next | null;
    autocomplete(): Next | null;
    toString(): string;
}
