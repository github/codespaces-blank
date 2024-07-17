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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.omit = void 0;
var fromEntries_1 = require("./fromEntries");
var hasAtLeast_1 = require("./hasAtLeast");
var purry_1 = require("./purry");
function omit() {
    return (0, purry_1.purry)(_omit, arguments);
}
exports.omit = omit;
function _omit(data, propNames) {
    if (!(0, hasAtLeast_1.hasAtLeast)(propNames, 1)) {
        return __assign({}, data);
    }
    if (!(0, hasAtLeast_1.hasAtLeast)(propNames, 2)) {
        var propName = propNames[0];
        var _a = data, _b = propName, omitted = _a[_b], remaining = __rest(_a, [typeof _b === "symbol" ? _b : _b + ""]);
        return remaining;
    }
    if (!propNames.some(function (propName) { return propName in data; })) {
        return __assign({}, data);
    }
    var asSet = new Set(propNames);
    return (0, fromEntries_1.fromEntries)(Object.entries(data).filter(function (_a) {
        var key = _a[0];
        return !asSet.has(key);
    }));
}
