"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.multiply = void 0;
var purry_1 = require("./purry");
function multiply() {
    return (0, purry_1.purry)(_multiply, arguments);
}
exports.multiply = multiply;
function _multiply(value, multiplicand) {
    return value * multiplicand;
}
