"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EOLState = void 0;
const state_1 = require("../state");
class EOLState extends state_1.State {
    constructor(child = null) {
        super(child);
        this.child = child;
    }
    accept(character) {
        return null;
    }
    toString() {
        return 'EOL';
    }
}
exports.EOLState = EOLState;
