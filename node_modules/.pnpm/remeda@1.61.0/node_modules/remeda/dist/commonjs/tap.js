"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tap = void 0;
var purry_1 = require("./purry");
function tap() {
    return (0, purry_1.purry)(_tap, arguments);
}
exports.tap = tap;
function _tap(value, fn) {
    fn(value);
    return value;
}
