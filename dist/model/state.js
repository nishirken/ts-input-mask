"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.State = void 0;
const isNull_1 = require("../util/isNull");
class State {
    constructor(child) {
        this.child = child;
    }
    autocomplete() {
        return null;
    }
    nextState() {
        if (!(0, isNull_1.isNull)(this.child)) {
            return this.child;
        }
        else {
            throw new Error('Value cannot be null');
        }
    }
    toString() {
        return 'BASE -> ' + !(0, isNull_1.isNull)(this.child) ? this.child.toString() : 'null';
    }
}
exports.State = State;
