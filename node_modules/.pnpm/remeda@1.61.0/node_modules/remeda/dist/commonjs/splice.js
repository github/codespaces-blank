"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.splice = void 0;
var purry_1 = require("./purry");
function splice() {
    return (0, purry_1.purry)(_splice, arguments);
}
exports.splice = splice;
function _splice(items, start, deleteCount, replacement) {
    var result = items.slice();
    result.splice.apply(result, __spreadArray([start, deleteCount], replacement, false));
    return result;
}
