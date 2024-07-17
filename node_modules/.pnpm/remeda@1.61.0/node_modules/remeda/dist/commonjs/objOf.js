"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.objOf = void 0;
var purry_1 = require("./purry");
function objOf() {
    return (0, purry_1.purry)(_objOf, arguments);
}
exports.objOf = objOf;
function _objOf(value, key) {
    var _a;
    return _a = {}, _a[key] = value, _a;
}
