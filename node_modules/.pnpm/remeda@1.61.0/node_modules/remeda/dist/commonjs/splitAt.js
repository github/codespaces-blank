"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.splitAt = void 0;
var purry_1 = require("./purry");
function splitAt() {
    return (0, purry_1.purry)(_splitAt, arguments);
}
exports.splitAt = splitAt;
function _splitAt(array, index) {
    var copy = array.slice();
    var tail = copy.splice(index);
    return [copy, tail];
}
