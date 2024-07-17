"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dropLast = void 0;
var purry_1 = require("./purry");
function dropLast() {
    return (0, purry_1.purry)(_dropLast, arguments);
}
exports.dropLast = dropLast;
function _dropLast(array, n) {
    var copy = array.slice();
    if (n > 0) {
        copy.splice(-n);
    }
    return copy;
}
