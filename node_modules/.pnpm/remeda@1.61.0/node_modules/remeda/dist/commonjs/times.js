"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.times = void 0;
var purry_1 = require("./purry");
function times() {
    return (0, purry_1.purry)(_times, arguments);
}
exports.times = times;
function _times(count, fn) {
    if (count < 0) {
        throw new RangeError("n must be a non-negative number");
    }
    var res = [];
    for (var i = 0; i < count; i++) {
        res.push(fn(i));
    }
    return res;
}
