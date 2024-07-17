"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pickBy = void 0;
var keys_1 = require("./keys");
var purry_1 = require("./purry");
function pickBy() {
    return (0, purry_1.purry)(_pickBy, arguments);
}
exports.pickBy = pickBy;
function _pickBy(data, fn) {
    if (data === null || data === undefined) {
        return {};
    }
    var out = {};
    for (var _i = 0, _a = keys_1.keys.strict(data); _i < _a.length; _i++) {
        var key = _a[_i];
        if (fn(data[key], key)) {
            out[key] = data[key];
        }
    }
    return out;
}
