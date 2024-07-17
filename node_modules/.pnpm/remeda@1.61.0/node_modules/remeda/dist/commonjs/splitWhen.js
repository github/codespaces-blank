"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.splitWhen = void 0;
var splitAt_1 = require("./splitAt");
var purry_1 = require("./purry");
function splitWhen() {
    return (0, purry_1.purry)(_splitWhen, arguments);
}
exports.splitWhen = splitWhen;
function _splitWhen(array, fn) {
    for (var i = 0; i < array.length; i++) {
        if (fn(array[i])) {
            return (0, splitAt_1.splitAt)(array, i);
        }
    }
    return [array.slice(), []];
}
