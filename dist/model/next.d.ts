import { State } from './state';
export declare class Next {
    readonly state: State;
    readonly insert: string | null;
    readonly pass: boolean;
    readonly value: string | null;
    constructor(state: State, insert: string | null, pass: boolean, value: string | null);
}
