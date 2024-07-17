"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.constant = void 0;
function constant(value) {
    return function () { return value; };
}
exports.constant = constant;
