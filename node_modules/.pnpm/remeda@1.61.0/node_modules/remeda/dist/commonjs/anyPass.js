"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.anyPass = void 0;
var purry_1 = require("./purry");
function anyPass() {
    return (0, purry_1.purry)(_anyPass, arguments);
}
exports.anyPass = anyPass;
function _anyPass(data, fns) {
    return fns.some(function (fn) { return fn(data); });
}
