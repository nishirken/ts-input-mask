"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OptionalValueState = void 0;
const state_1 = require("../state");
const next_1 = require("../next");
require("../../util/string");
const isNull_1 = require("../../util/isNull");
class OptionalValueState extends state_1.State {
    constructor(child, type) {
        super(child);
        this.child = child;
        this.type = type;
    }
    accept(character) {
        if (this.accepts(character)) {
            return new next_1.Next(this.nextState(), character, true, character);
        }
        else {
            return new next_1.Next(this.nextState(), null, false, null);
        }
    }
    toString() {
        const type = this.type;
        if (type instanceof OptionalValueState.Numeric) {
            return '[a] -> ' + (!(0, isNull_1.isNull)(this.child) ? this.child.toString() : 'null');
        }
        else if (type instanceof OptionalValueState.Literal) {
            return '[9] -> ' + (!(0, isNull_1.isNull)(this.child) ? this.child.toString() : 'null');
        }
        else if (type instanceof OptionalValueState.AlphaNumeric) {
            return '[-] -> ' + (!(0, isNull_1.isNull)(this.child) ? this.child.toString() : 'null');
        }
        else if (type instanceof OptionalValueState.Custom) {
            return `[${type.character}] -> ` + (!(0, isNull_1.isNull)(this.child) ? this.child.toString() : 'null');
        }
        else {
            throw new Error("Doesn't match any supported type");
        }
    }
    accepts(character) {
        const type = this.type;
        if (type instanceof OptionalValueState.Numeric) {
            return character.isDigit();
        }
        else if (type instanceof OptionalValueState.Literal) {
            return character.isLetter();
        }
        else if (type instanceof OptionalValueState.AlphaNumeric) {
            return character.isLetterOrDigit();
        }
        else if (type instanceof OptionalValueState.Custom) {
            return type.characterSet.includes(character);
        }
        else {
            throw new Error("Doesn't match any supported type");
        }
    }
}
exports.OptionalValueState = OptionalValueState;
(function (OptionalValueState) {
    class StateType {
    }
    OptionalValueState.StateType = StateType;
    class Literal extends StateType {
    }
    OptionalValueState.Literal = Literal;
    class Numeric extends StateType {
    }
    OptionalValueState.Numeric = Numeric;
    class AlphaNumeric extends StateType {
    }
    OptionalValueState.AlphaNumeric = AlphaNumeric;
    class Ellipsis extends StateType {
        constructor(inheritedType) {
            super();
            this.inheritedType = inheritedType;
        }
    }
    OptionalValueState.Ellipsis = Ellipsis;
    class Custom extends StateType {
        constructor(character, characterSet) {
            super();
            this.character = character;
            this.characterSet = characterSet;
        }
    }
    OptionalValueState.Custom = Custom;
})(OptionalValueState = exports.OptionalValueState || (exports.OptionalValueState = {}));
