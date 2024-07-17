"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allPass = void 0;
var purry_1 = require("./purry");
function allPass() {
    return (0, purry_1.purry)(_allPass, arguments);
}
exports.allPass = allPass;
function _allPass(data, fns) {
    return fns.every(function (fn) { return fn(data); });
}
