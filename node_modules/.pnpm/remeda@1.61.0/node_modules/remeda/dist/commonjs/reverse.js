"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reverse = void 0;
var purry_1 = require("./purry");
function reverse() {
    return (0, purry_1.purry)(_reverse, arguments);
}
exports.reverse = reverse;
function _reverse(array) {
    return array.slice().reverse();
}
