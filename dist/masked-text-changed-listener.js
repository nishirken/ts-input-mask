"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaskedTextChangedListener = void 0;
const model_1 = require("./model");
const affinity_calculation_strategy_1 = require("./helper/affinity-calculation-strategy");
const mask_1 = require("./helper/mask");
const mask_affinity_1 = require("./helper/mask-affinity");
class MaskedTextChangedListener {
    constructor(primaryFormat, field, listener, affineFormats = [], customNotations = [], affinityCalculationStrategy = new affinity_calculation_strategy_1.AffinityCalculation(affinity_calculation_strategy_1.AffinityCalculationStrategy.WHOLE_STRING), autocomplete = true) {
        this.primaryFormat = primaryFormat;
        this.field = field;
        this.listener = listener;
        this.affineFormats = affineFormats;
        this.customNotations = customNotations;
        this.affinityCalculationStrategy = affinityCalculationStrategy;
        this.autocomplete = autocomplete;
        this.afterText = '';
        this.caretPosition = 0;
        this.placeholder = () => this.primaryMask.placeholder();
        this.acceptableTextLength = () => this.primaryMask.acceptableTextLength();
        this.totalTextLength = () => this.primaryMask.totalTextLength();
        this.totalValueLength = () => this.primaryMask.totalValueLength();
        this.dispose = () => {
            this.field.removeEventListener('input', this.handleInputChange);
            this.field.removeEventListener('focus', this.handleFocus);
            this.field.removeEventListener('blur', this.handleBlur);
        };
        this.handleInputChange = (ev) => {
            this.onTextChanged(ev.target.value, ev);
        };
        this.handleFocus = () => this.onFocusChange(true);
        this.handleBlur = () => this.onFocusChange(false);
        this.primaryMask = mask_1.Mask.getOrCreate(this.primaryFormat, this.customNotations);
        this.addEvents(field);
    }
    static installOn(primaryFormat, field, listener, affineFormats = [], customNotations = [], affinityCalculationStrategy = new affinity_calculation_strategy_1.AffinityCalculation(affinity_calculation_strategy_1.AffinityCalculationStrategy.WHOLE_STRING), autocomplete = true) {
        return new MaskedTextChangedListener(primaryFormat, field, listener, affineFormats, customNotations, affinityCalculationStrategy, autocomplete);
    }
    setText(text) {
        let result = null;
        if (!this.field.value || this.field.value === '') {
            result = this._setText(text, this.field);
            this.afterText = result.formattedText.str;
            this.caretPosition = result.formattedText.caretPosition;
            if (!!this.listener) {
                this.listener.onTextChanged(result.complete, result.extractedValue, this.afterText);
            }
        }
        return result;
    }
    _setText(text, field) {
        const result = this.pickMask(text, text.length, this.autocomplete).apply(new model_1.CaretString(text, text.length), this.autocomplete);
        field.value = String(result.formattedText.str);
        field.setSelectionRange(result.formattedText.caretPosition, result.formattedText.caretPosition);
        return result;
    }
    pickMask(text, caretPosition, autocomplete) {
        text = String(text);
        if (this.affineFormats.length === 0) {
            return this.primaryMask;
        }
        const primaryAffinity = this.calculateAffinity(this.primaryMask, text, caretPosition, autocomplete);
        const maskAndAffinities = [];
        for (const format of this.affineFormats) {
            const mask = new mask_1.Mask(format, this.customNotations);
            const affinity = this.calculateAffinity(mask, text, caretPosition, autocomplete);
            maskAndAffinities.push(new mask_affinity_1.MaskAffinity(mask, affinity));
        }
        maskAndAffinities.sort((a, b) => b.affinity - a.affinity);
        let insertIndex = -1;
        maskAndAffinities.some((maskAffinity, index) => {
            if (primaryAffinity >= maskAffinity.affinity) {
                insertIndex = index;
            }
            return primaryAffinity >= maskAffinity.affinity;
        });
        if (insertIndex >= 0) {
            maskAndAffinities[insertIndex] = new mask_affinity_1.MaskAffinity(this.primaryMask, primaryAffinity);
        }
        else {
            maskAndAffinities.push(new mask_affinity_1.MaskAffinity(this.primaryMask, primaryAffinity));
        }
        return maskAndAffinities[0].mask;
    }
    calculateAffinity(mask, text, caretPosition, autocomplete) {
        return this.affinityCalculationStrategy.calculateAffinityOfMask(mask, new model_1.CaretString(text, caretPosition), autocomplete);
    }
    addEvents(field) {
        field.addEventListener('input', this.handleInputChange);
        field.addEventListener('focus', this.handleFocus);
        field.addEventListener('blur', this.handleBlur);
    }
    onFocusChange(hasFocus) {
        if (this.autocomplete && hasFocus) {
            const text = !!this.field.value ? this.field.value : '';
            const result = this.pickMask(text, text.length, this.autocomplete).apply(new model_1.CaretString(text, text.length), this.autocomplete);
            this.afterText = result.formattedText.str;
            this.caretPosition = result.formattedText.caretPosition;
            this.field.value = String(this.afterText);
            this.field.setSelectionRange(result.formattedText.caretPosition, result.formattedText.caretPosition);
            if (!!this.listener) {
                this.listener.onTextChanged(result.complete, result.extractedValue, this.afterText);
            }
        }
    }
    onTextChanged(text, event) {
        const isDeletion = event.inputType === 'deleteContentForward'
            || event.inputType === 'deleteContentBackward';
        const isInside = this.field.selectionStart < text.length;
        const caretPosition = (isDeletion || isInside) ? this.field.selectionStart : text.length;
        const result = this.pickMask(text, caretPosition, this.autocomplete && !isDeletion).apply(new model_1.CaretString(text, caretPosition), this.autocomplete && !isDeletion);
        this.afterText = result.formattedText.str;
        this.caretPosition = (isDeletion || isInside)
            ? this.field.selectionStart
            : result.formattedText.caretPosition;
        this.field.value = String(this.afterText);
        this.field.setSelectionRange(this.caretPosition, this.caretPosition);
        if (!!this.listener) {
            this.listener.onTextChanged(result.complete, result.extractedValue, this.afterText);
        }
    }
}
exports.MaskedTextChangedListener = MaskedTextChangedListener;
