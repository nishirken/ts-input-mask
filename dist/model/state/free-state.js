"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FreeState = void 0;
const state_1 = require("../state");
const next_1 = require("../next");
const isNull_1 = require("../../util/isNull");
class FreeState extends state_1.State {
    constructor(child, ownCharacter) {
        super(child);
        this.child = child;
        this.ownCharacter = ownCharacter;
    }
    accept(character) {
        if (this.ownCharacter === character) {
            return new next_1.Next(this.nextState(), character, true, null);
        }
        else {
            return new next_1.Next(this.nextState(), this.ownCharacter, false, null);
        }
    }
    autocomplete() {
        return new next_1.Next(this.nextState(), this.ownCharacter, false, null);
    }
    toString() {
        return `${this.ownCharacter} -> ` + (!(0, isNull_1.isNull)(this.child) ? this.child.toString() : 'null');
    }
}
exports.FreeState = FreeState;
