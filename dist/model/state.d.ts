import { Next } from './next';
export declare abstract class State {
    readonly child: State | null;
    protected constructor(child: State | null);
    abstract accept(character: string): Next | null;
    autocomplete(): Next | null;
    nextState(): State | never;
    toString(): string;
}
