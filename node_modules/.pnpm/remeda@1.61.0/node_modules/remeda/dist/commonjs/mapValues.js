"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapValues = void 0;
var purry_1 = require("./purry");
var toPairs_1 = require("./toPairs");
function mapValues() {
    return (0, purry_1.purry)(_mapValues, arguments);
}
exports.mapValues = mapValues;
function _mapValues(data, fn) {
    var out = {};
    for (var _i = 0, _a = toPairs_1.toPairs.strict(data); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], value = _b[1];
        var mappedValue = fn(value, key);
        out[key] = mappedValue;
    }
    return out;
}
