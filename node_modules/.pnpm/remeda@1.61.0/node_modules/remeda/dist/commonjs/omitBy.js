"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.omitBy = void 0;
var keys_1 = require("./keys");
var purry_1 = require("./purry");
function omitBy() {
    return (0, purry_1.purry)(_omitBy, arguments);
}
exports.omitBy = omitBy;
function _omitBy(object, fn) {
    if (object === undefined || object === null) {
        return object;
    }
    var out = {};
    for (var _i = 0, _a = keys_1.keys.strict(object); _i < _a.length; _i++) {
        var key = _a[_i];
        if (!fn(object[key], key)) {
            out[key] = object[key];
        }
    }
    return out;
}
