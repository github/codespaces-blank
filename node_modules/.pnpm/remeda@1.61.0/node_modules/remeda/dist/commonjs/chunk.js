"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chunk = void 0;
var purry_1 = require("./purry");
function chunk() {
    return (0, purry_1.purry)(_chunk, arguments);
}
exports.chunk = chunk;
function _chunk(array, size) {
    var ret = [];
    for (var offset = 0; offset < array.length; offset += size) {
        ret.push(array.slice(offset, offset + size));
    }
    return ret;
}
