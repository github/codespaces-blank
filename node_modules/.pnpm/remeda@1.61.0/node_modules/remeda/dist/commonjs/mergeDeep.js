"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeDeep = void 0;
var purry_1 = require("./purry");
function mergeDeep() {
    return (0, purry_1.purry)(mergeDeepImplementation, arguments);
}
exports.mergeDeep = mergeDeep;
function mergeDeepImplementation(destination, source) {
    var output = __assign(__assign({}, destination), source);
    for (var key in source) {
        if (!(key in destination)) {
            continue;
        }
        var _a = destination, _b = key, destinationValue = _a[_b];
        if (!isRecord(destinationValue)) {
            continue;
        }
        var _c = source, _d = key, sourceValue = _c[_d];
        if (!isRecord(sourceValue)) {
            continue;
        }
        output[key] = mergeDeepImplementation(destinationValue, sourceValue);
    }
    return output;
}
function isRecord(object) {
    return (typeof object === "object" &&
        object !== null &&
        Object.getPrototypeOf(object) === Object.prototype);
}
