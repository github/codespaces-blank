"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clamp = void 0;
var purry_1 = require("./purry");
function clamp() {
    return (0, purry_1.purry)(_clamp, arguments);
}
exports.clamp = clamp;
function _clamp(value, _a) {
    var min = _a.min, max = _a.max;
    return min !== undefined && value < min
        ? min
        : max !== undefined && value > max
            ? max
            : value;
}
