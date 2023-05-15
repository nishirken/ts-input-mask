"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mask = void 0;
const model_1 = require("../model");
const compiler_1 = require("./compiler");
const caret_string_iterator_1 = require("./caret-string-iterator");
class Mask {
    constructor(format, customNotations) {
        this.format = format;
        this.customNotations = customNotations;
        this.initialState = new compiler_1.Compiler(this.customNotations).compile(this.format);
        this.placeholder = () => this.appendPlaceholder(this.initialState, '');
    }
    static getOrCreate(format, customNotations) {
        let cachedMask = Mask.cache.get(format);
        if (!cachedMask) {
            cachedMask = new Mask(format, customNotations);
            Mask.cache.set(format, cachedMask);
        }
        return cachedMask;
    }
    apply(text, autocomplete) {
        const iterator = new caret_string_iterator_1.CaretStringIterator(text);
        let affinity = 0;
        let extractedValue = '';
        let modifiedString = '';
        let modifiedCaretPosition = text.caretPosition;
        let state = this.initialState;
        let beforeCaret = iterator.beforeCaret();
        let character = iterator.next();
        let next;
        while (!!character) {
            next = state.accept(character);
            if (!!next) {
                state = next.state;
                modifiedString += !!next.insert ? next.insert : '';
                extractedValue += !!next.value ? next.value : '';
                if (next.pass) {
                    beforeCaret = iterator.beforeCaret();
                    character = iterator.next();
                    ++affinity;
                }
                else {
                    if (beforeCaret && next.insert !== null) {
                        ++modifiedCaretPosition;
                    }
                    --affinity;
                }
            }
            else {
                if (iterator.beforeCaret()) {
                    --modifiedCaretPosition;
                }
                beforeCaret = iterator.beforeCaret();
                character = iterator.next();
                --affinity;
            }
        }
        while (autocomplete && beforeCaret) {
            const nxt = state.autocomplete();
            if (nxt === null) {
                break;
            }
            state = nxt.state;
            modifiedString += !!nxt.insert ? nxt.insert : '';
            extractedValue += !!nxt.value ? nxt.value : '';
            if (nxt.insert !== null) {
                ++modifiedCaretPosition;
            }
        }
        return new Mask.Result(new model_1.CaretString(modifiedString, modifiedCaretPosition), extractedValue, affinity, this.noMandatoryCharactersLeftAfterState(state));
    }
    acceptableTextLength() {
        let state = this.initialState;
        let length = 0;
        while (!!state && !(state instanceof model_1.EOLState)) {
            if (state instanceof model_1.FixedState
                || state instanceof model_1.FreeState
                || state instanceof model_1.ValueState) {
                ++length;
            }
            state = state.child;
        }
        return length;
    }
    totalTextLength() {
        let state = this.initialState;
        let length = 0;
        while (!!state && !(state instanceof model_1.EOLState)) {
            if (state instanceof model_1.FixedState
                || state instanceof model_1.FreeState
                || state instanceof model_1.ValueState
                || state instanceof model_1.OptionalValueState) {
                ++length;
            }
            state = state.child;
        }
        return length;
    }
    acceptableValueLength() {
        let state = this.initialState;
        let length = 0;
        while (!!state && !(state instanceof model_1.EOLState)) {
            if (state instanceof model_1.FixedState
                || state instanceof model_1.ValueState) {
                ++length;
            }
            state = state.child;
        }
        return length;
    }
    totalValueLength() {
        let state = this.initialState;
        let length = 0;
        while (!!state && !(state instanceof model_1.EOLState)) {
            if (state instanceof model_1.FixedState
                || state instanceof model_1.ValueState
                || state instanceof model_1.OptionalValueState) {
                ++length;
            }
            state = state.child;
        }
        return length;
    }
    noMandatoryCharactersLeftAfterState(state) {
        if (state instanceof model_1.EOLState) {
            return true;
        }
        else if (state instanceof model_1.ValueState) {
            return state.isElliptical;
        }
        else if (state instanceof model_1.FixedState) {
            return false;
        }
        else {
            return this.noMandatoryCharactersLeftAfterState(state.nextState());
        }
    }
    appendPlaceholder(state, placeholder) {
        if (state === null) {
            return placeholder;
        }
        if (state instanceof model_1.EOLState) {
            return placeholder;
        }
        if (state instanceof model_1.FixedState) {
            return this.appendPlaceholder(state.child, placeholder.concat(state.ownCharacter.toString()));
        }
        if (state instanceof model_1.FreeState) {
            return this.appendPlaceholder(state.child, placeholder.concat(state.ownCharacter.toString()));
        }
        if (state instanceof model_1.OptionalValueState) {
            if (state.type instanceof model_1.OptionalValueState.AlphaNumeric) {
                return this.appendPlaceholder(state.child, placeholder + '-');
            }
            if (state.type instanceof model_1.OptionalValueState.Numeric) {
                return this.appendPlaceholder(state.child, placeholder + '0');
            }
            if (state.type instanceof model_1.OptionalValueState.Literal) {
                return this.appendPlaceholder(state.child, placeholder + 'a');
            }
            if (state.type instanceof model_1.OptionalValueState.Custom) {
                return this.appendPlaceholder(state.child, placeholder.concat(state.type.character.toString()));
            }
        }
        if (state instanceof model_1.ValueState) {
            if (state.type instanceof model_1.ValueState.AlphaNumeric) {
                return this.appendPlaceholder(state.child, placeholder + '-');
            }
            if (state.type instanceof model_1.ValueState.Numeric) {
                return this.appendPlaceholder(state.child, placeholder + '0');
            }
            if (state.type instanceof model_1.ValueState.Literal) {
                return this.appendPlaceholder(state.child, placeholder + 'a');
            }
            if (state.type instanceof model_1.ValueState.Ellipsis) {
                return placeholder;
            }
            if (state.type instanceof model_1.ValueState.Custom) {
                return this.appendPlaceholder(state.child, placeholder.concat(state.type.character.toString()));
            }
        }
        return placeholder;
    }
}
exports.Mask = Mask;
Mask.cache = new Map();
(function (Mask) {
    class Result {
        constructor(formattedText, extractedValue, affinity, complete) {
            this.formattedText = formattedText;
            this.extractedValue = extractedValue;
            this.affinity = affinity;
            this.complete = complete;
        }
    }
    Mask.Result = Result;
})(Mask = exports.Mask || (exports.Mask = {}));
