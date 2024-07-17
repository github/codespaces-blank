"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.concat = void 0;
var purry_1 = require("./purry");
function concat() {
    return (0, purry_1.purry)(_concat, arguments);
}
exports.concat = concat;
function _concat(arr1, arr2) {
    return arr1.concat(arr2);
}
