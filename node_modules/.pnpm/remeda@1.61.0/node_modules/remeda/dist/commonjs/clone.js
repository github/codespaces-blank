"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clone = void 0;
var type_1 = require("./type");
function _cloneRegExp(pattern) {
    return new RegExp(pattern.source, (pattern.global ? "g" : "") +
        (pattern.ignoreCase ? "i" : "") +
        (pattern.multiline ? "m" : "") +
        (pattern.sticky ? "y" : "") +
        (pattern.unicode ? "u" : ""));
}
function _clone(value, refFrom, refTo, deep) {
    function copy(copiedValue) {
        var len = refFrom.length;
        var idx = 0;
        while (idx < len) {
            if (value === refFrom[idx]) {
                return refTo[idx];
            }
            idx += 1;
        }
        refFrom[idx + 1] = value;
        refTo[idx + 1] = copiedValue;
        for (var key in value) {
            copiedValue[key] = deep
                ? _clone(value[key], refFrom, refTo, true)
                : value[key];
        }
        return copiedValue;
    }
    switch ((0, type_1.type)(value)) {
        case "Object":
            return copy({});
        case "Array":
            return copy([]);
        case "Date":
            return new Date(value.valueOf());
        case "RegExp":
            return _cloneRegExp(value);
        default:
            return value;
    }
}
function clone(value) {
    return value != null && typeof value.clone === "function"
        ? value.clone()
        : _clone(value, [], [], true);
}
exports.clone = clone;
