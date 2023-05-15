"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValueState = void 0;
const state_1 = require("../state");
const next_1 = require("../next");
require("../../util/string");
const isNull_1 = require("../../util/isNull");
class ValueState extends state_1.State {
    constructor(child, type) {
        super(child);
        this.child = child;
        this.type = type;
        this.isElliptical = type instanceof ValueState.Ellipsis;
    }
    accept(character) {
        if (!this.accepts(character)) {
            return null;
        }
        return new next_1.Next(this.nextState(), character, true, character);
    }
    nextState() {
        if (this.type instanceof ValueState.Ellipsis) {
            return this;
        }
        else {
            return super.nextState();
        }
    }
    toString() {
        const type = this.type;
        if (type instanceof ValueState.Numeric) {
            return '[A] -> ' + (!(0, isNull_1.isNull)(this.child) ? this.child.toString() : 'null');
        }
        else if (type instanceof ValueState.Literal) {
            return '[0] -> ' + (!(0, isNull_1.isNull)(this.child) ? this.child.toString() : 'null');
        }
        else if (type instanceof ValueState.AlphaNumeric) {
            return '[_] -> ' + (!(0, isNull_1.isNull)(this.child) ? this.child.toString() : 'null');
        }
        else if (type instanceof ValueState.Ellipsis) {
            return '[...] -> ' + (!(0, isNull_1.isNull)(this.child) ? this.child.toString() : 'null');
        }
        else if (type instanceof ValueState.Custom) {
            return `[${type.character}] -> ` + (!(0, isNull_1.isNull)(this.child) ? this.child.toString() : 'null');
        }
        else {
            throw new Error("Doesn't match any supported type");
        }
    }
    accepts(character) {
        const type = this.type;
        if (type instanceof ValueState.Numeric) {
            return character.isDigit();
        }
        else if (type instanceof ValueState.Literal) {
            return character.isLetter();
        }
        else if (type instanceof ValueState.AlphaNumeric) {
            return character.isLetterOrDigit();
        }
        else if (type instanceof ValueState.Ellipsis) {
            if (type instanceof ValueState.Numeric) {
                return character.isDigit();
            }
            else if (type instanceof ValueState.Literal) {
                return character.isLetter();
            }
            else if (type instanceof ValueState.AlphaNumeric) {
                return character.isLetterOrDigit();
            }
            else {
                return false;
            }
        }
        else if (type instanceof ValueState.Custom) {
            return type.characterSet.includes(character);
        }
        else {
            throw new Error("Doesn't match any supported type");
        }
    }
}
exports.ValueState = ValueState;
(function (ValueState) {
    class StateType {
    }
    ValueState.StateType = StateType;
    class Literal extends StateType {
    }
    ValueState.Literal = Literal;
    class Numeric extends StateType {
    }
    ValueState.Numeric = Numeric;
    class AlphaNumeric extends StateType {
    }
    ValueState.AlphaNumeric = AlphaNumeric;
    class Ellipsis extends StateType {
        constructor(inheritedType) {
            super();
            this.inheritedType = inheritedType;
        }
    }
    ValueState.Ellipsis = Ellipsis;
    class Custom extends StateType {
        constructor(character, characterSet) {
            super();
            this.character = character;
            this.characterSet = characterSet;
        }
    }
    ValueState.Custom = Custom;
})(ValueState = exports.ValueState || (exports.ValueState = {}));
