"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.range = void 0;
var purry_1 = require("./purry");
function range() {
    return (0, purry_1.purry)(_range, arguments);
}
exports.range = range;
function _range(start, end) {
    var ret = [];
    for (var i = start; i < end; i++) {
        ret.push(i);
    }
    return ret;
}
