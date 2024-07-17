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
exports.set = void 0;
var purry_1 = require("./purry");
function set() {
    return (0, purry_1.purry)(_set, arguments);
}
exports.set = set;
function _set(obj, prop, value) {
    var _a;
    return __assign(__assign({}, obj), (_a = {}, _a[prop] = value, _a));
}
