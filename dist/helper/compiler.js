"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Compiler = void 0;
const model_1 = require("../model");
const format_sanitizer_1 = require("./format-sanitizer");
class Compiler {
    constructor(customNotations) {
        this.customNotations = customNotations;
    }
    compile(formatString) {
        try {
            const sanitizedString = format_sanitizer_1.FormatSanitizer.sanitize(formatString);
            return this._compile(sanitizedString, false, false, null);
        }
        catch (e) {
            throw new Error('Wrong format');
        }
    }
    _compile(formatString, valuable, fixed, lastCharacter) {
        if (formatString.isEmpty()) {
            return new model_1.EOLState();
        }
        const char = formatString.first();
        switch (char) {
            case '[': {
                if (lastCharacter !== '\\') {
                    return this._compile(formatString.substring(1), true, false, char);
                }
                break;
            }
            case '{': {
                if (lastCharacter !== '\\') {
                    return this._compile(formatString.substring(1), false, true, char);
                }
                break;
            }
            case ']': {
                if (lastCharacter !== '\\') {
                    return this._compile(formatString.substring(1), false, false, char);
                }
                break;
            }
            case '}': {
                if (lastCharacter !== '\\') {
                    return this._compile(formatString.substring(1), false, false, char);
                }
                break;
            }
            case '\\': {
                if (lastCharacter !== '\\') {
                    return this._compile(formatString.substring(1), valuable, fixed, char);
                }
                break;
            }
        }
        if (valuable) {
            switch (char) {
                case '0': {
                    return new model_1.ValueState(this._compile(formatString.substring(1), true, false, char), new model_1.ValueState.Numeric());
                }
                case 'A': {
                    return new model_1.ValueState(this._compile(formatString.substring(1), true, false, char), new model_1.ValueState.Literal());
                }
                case '_': {
                    return new model_1.ValueState(this._compile(formatString.substring(1), true, false, char), new model_1.ValueState.AlphaNumeric());
                }
                case '...': {
                    return new model_1.ValueState(null, this.determineInheritedType(lastCharacter));
                }
                case '9': {
                    return new model_1.OptionalValueState(this._compile(formatString.substring(1), true, false, char), new model_1.OptionalValueState.Numeric());
                }
                case 'a': {
                    return new model_1.OptionalValueState(this._compile(formatString.substring(1), true, false, char), new model_1.OptionalValueState.Literal());
                }
                case '-': {
                    return new model_1.OptionalValueState(this._compile(formatString.substring(1), true, false, char), new model_1.OptionalValueState.AlphaNumeric());
                }
                default: {
                    return this.compileWithCustomNotations(char, formatString);
                }
            }
        }
        if (fixed) {
            return new model_1.FixedState(this._compile(formatString.substring(1), false, true, char), char);
        }
        return new model_1.FreeState(this._compile(formatString.substring(1), false, false, char), char);
    }
    determineInheritedType(lastCharacter) {
        switch (lastCharacter) {
            case '0' || '9': {
                return new model_1.ValueState.Numeric();
            }
            case 'A' || 'a': {
                return new model_1.ValueState.Literal();
            }
            case '_' || '_': {
                return new model_1.ValueState.AlphaNumeric();
            }
            case '...': {
                return new model_1.ValueState.AlphaNumeric();
            }
            case '[': {
                return new model_1.ValueState.AlphaNumeric();
            }
            default: {
                return this.determineTypeWithCustomNotation(lastCharacter);
            }
        }
    }
    compileWithCustomNotations(char, str) {
        const notation = this.customNotations.find(x => x.character === char);
        if (!notation)
            throw new Error('Wrong format');
        if (notation.isOptional) {
            return new model_1.OptionalValueState(this._compile(str.substring(1), true, false, char), new model_1.OptionalValueState.Custom(char, notation.characterSet));
        }
        else {
            return new model_1.ValueState(this._compile(str.substring(1), true, false, char), new model_1.ValueState.Custom(char, notation.characterSet));
        }
    }
    determineTypeWithCustomNotation(lastCharacter) {
        for (const notation of this.customNotations) {
            if (notation.character === lastCharacter) {
                return new model_1.ValueState.Custom(lastCharacter, notation.characterSet);
            }
        }
        throw new Error('Wrong format');
    }
}
exports.Compiler = Compiler;
