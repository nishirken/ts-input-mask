"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CaretStringIterator = void 0;
class CaretStringIterator {
    constructor(caretString, currentIndex = 0) {
        this.caretString = caretString;
        this.currentIndex = currentIndex;
    }
    beforeCaret() {
        return this.currentIndex <= this.caretString.caretPosition
            || (this.currentIndex === 0 && this.caretString.caretPosition === 0);
    }
    next() {
        if (this.currentIndex >= this.caretString.str.length) {
            return null;
        }
        const char = this.caretString.str.toCharArray()[this.currentIndex];
        ++this.currentIndex;
        return char;
    }
}
exports.CaretStringIterator = CaretStringIterator;
