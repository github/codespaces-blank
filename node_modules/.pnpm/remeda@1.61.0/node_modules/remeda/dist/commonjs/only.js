"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.only = void 0;
var purry_1 = require("./purry");
function only() {
    return (0, purry_1.purry)(_only, arguments);
}
exports.only = only;
function _only(array) {
    return array.length === 1 ? array[0] : undefined;
}
