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
import { fromEntries } from "./fromEntries";
import { hasAtLeast } from "./hasAtLeast";
import { purry } from "./purry";
export function omit() {
    return purry(_omit, arguments);
}
function _omit(data, propNames) {
    if (!hasAtLeast(propNames, 1)) {
        return __assign({}, data);
    }
    if (!hasAtLeast(propNames, 2)) {
        var propName = propNames[0];
        var _a = data, _b = propName, omitted = _a[_b], remaining = __rest(_a, [typeof _b === "symbol" ? _b : _b + ""]);
        return remaining;
    }
    if (!propNames.some(function (propName) { return propName in data; })) {
        return __assign({}, data);
    }
    var asSet = new Set(propNames);
    return fromEntries(Object.entries(data).filter(function (_a) {
        var key = _a[0];
        return !asSet.has(key);
    }));
}
