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
exports._setPath = exports.setPath = void 0;
var purry_1 = require("./purry");
function setPath() {
    return (0, purry_1.purry)(_setPath, arguments);
}
exports.setPath = setPath;
function _setPath(data, path, value) {
    var _a;
    var current = path[0], rest = path.slice(1);
    if (current === undefined) {
        return value;
    }
    if (Array.isArray(data)) {
        return data.map(function (item, index) {
            return index === current ? _setPath(item, rest, value) : item;
        });
    }
    if (data === null || data === undefined) {
        throw new Error("Path doesn't exist in object!");
    }
    return __assign(__assign({}, data), (_a = {}, _a[current] = _setPath(data[current], rest, value), _a));
}
exports._setPath = _setPath;
