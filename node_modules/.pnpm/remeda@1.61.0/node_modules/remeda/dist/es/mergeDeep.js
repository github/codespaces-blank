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
import { purry } from "./purry";
export function mergeDeep() {
    return purry(mergeDeepImplementation, arguments);
}
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
