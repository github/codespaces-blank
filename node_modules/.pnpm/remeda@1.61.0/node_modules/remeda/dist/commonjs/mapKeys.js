"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapKeys = void 0;
var purry_1 = require("./purry");
var toPairs_1 = require("./toPairs");
function mapKeys() {
    return (0, purry_1.purry)(_mapKeys, arguments);
}
exports.mapKeys = mapKeys;
function _mapKeys(data, fn) {
    var out = {};
    for (var _i = 0, _a = toPairs_1.toPairs.strict(data); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], value = _b[1];
        out[fn(key, value)] = value;
    }
    return out;
}
