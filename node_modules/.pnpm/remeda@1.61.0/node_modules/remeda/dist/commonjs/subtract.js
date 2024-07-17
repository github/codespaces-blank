"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subtract = void 0;
var purry_1 = require("./purry");
function subtract() {
    return (0, purry_1.purry)(_subtract, arguments);
}
exports.subtract = subtract;
function _subtract(value, subtrahend) {
    return value - subtrahend;
}
