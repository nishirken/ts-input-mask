import { State } from '../state';
import { Next } from '../next';
export declare class EOLState extends State {
    readonly child: State;
    constructor(child?: State);
    accept(character: string): Next | null;
    toString(): string;
}
