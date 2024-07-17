"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.divide = void 0;
var purry_1 = require("./purry");
function divide() {
    return (0, purry_1.purry)(_divide, arguments);
}
exports.divide = divide;
function _divide(value, divisor) {
    return value / divisor;
}
