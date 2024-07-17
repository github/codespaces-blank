"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invert = void 0;
var purry_1 = require("./purry");
function invert() {
    return (0, purry_1.purry)(_invert, arguments);
}
exports.invert = invert;
function _invert(object) {
    var result = {};
    for (var key in object) {
        if (Object.prototype.hasOwnProperty.call(object, key)) {
            result[object[key]] = key;
        }
    }
    return result;
}
