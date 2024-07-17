"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.length = void 0;
var purry_1 = require("./purry");
function length() {
    return (0, purry_1.purry)(_length, arguments);
}
exports.length = length;
function _length(items) {
    return "length" in items ? items.length : Array.from(items).length;
}
