"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AffinityCalculation = exports.AffinityCalculationStrategy = void 0;
const model_1 = require("../model");
require("../util/string");
var AffinityCalculationStrategy;
(function (AffinityCalculationStrategy) {
    AffinityCalculationStrategy[AffinityCalculationStrategy["WHOLE_STRING"] = 0] = "WHOLE_STRING";
    AffinityCalculationStrategy[AffinityCalculationStrategy["PREFIX"] = 1] = "PREFIX";
})(AffinityCalculationStrategy = exports.AffinityCalculationStrategy || (exports.AffinityCalculationStrategy = {}));
class AffinityCalculation {
    constructor(strategy) {
        this.strategy = strategy;
    }
    calculateAffinityOfMask(mask, text, autocomplete) {
        switch (this.strategy) {
            case AffinityCalculationStrategy.WHOLE_STRING: {
                return mask.apply(new model_1.CaretString(text.str, text.caretPosition), autocomplete).affinity;
            }
            case AffinityCalculationStrategy.PREFIX: {
                return mask.apply(new model_1.CaretString(text.str, text.caretPosition), autocomplete).formattedText.str.prefixIntersection(text.str).length;
            }
        }
    }
}
exports.AffinityCalculation = AffinityCalculation;
