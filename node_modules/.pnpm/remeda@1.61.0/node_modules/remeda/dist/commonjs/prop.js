"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prop = void 0;
var prop = function (propName) {
    return function (_a) {
        var _b = propName, value = _a[_b];
        return value;
    };
};
exports.prop = prop;
