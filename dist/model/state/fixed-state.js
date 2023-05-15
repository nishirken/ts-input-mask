"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FixedState = void 0;
const state_1 = require("../state");
const next_1 = require("../next");
const isNull_1 = require("../../util/isNull");
class FixedState extends state_1.State {
    constructor(child, ownCharacter) {
        super(child);
        this.child = child;
        this.ownCharacter = ownCharacter;
    }
    accept(character) {
        if (this.ownCharacter === character) {
            return new next_1.Next(this.nextState(), character, true, character);
        }
        else {
            return new next_1.Next(this.nextState(), this.ownCharacter, false, this.ownCharacter);
        }
    }
    autocomplete() {
        return new next_1.Next(this.nextState(), this.ownCharacter, false, this.ownCharacter);
    }
    toString() {
        return `{${this.ownCharacter}} -> ` + (!(0, isNull_1.isNull)(this.child) ? this.child.toString() : 'null');
    }
}
exports.FixedState = FixedState;
