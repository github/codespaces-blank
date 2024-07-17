"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.add = void 0;
var purry_1 = require("./purry");
function add() {
    return (0, purry_1.purry)(_add, arguments);
}
exports.add = add;
function _add(value, addend) {
    return value + addend;
}
