"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.last = void 0;
var purry_1 = require("./purry");
function last() {
    return (0, purry_1.purry)(_last, arguments);
}
exports.last = last;
function _last(data) {
    return data[data.length - 1];
}
