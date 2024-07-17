import { purry } from "./purry";
export function equals() {
    return purry(_equals, arguments);
}
function _equals(a, b) {
    if (a === b) {
        return true;
    }
    if (typeof a === "number" && typeof b === "number") {
        return a !== a && b !== b;
    }
    if (typeof a !== "object" || typeof b !== "object") {
        return false;
    }
    if (a === null || b === null) {
        return false;
    }
    var isArrayA = Array.isArray(a);
    var isArrayB = Array.isArray(b);
    if (isArrayA && isArrayB) {
        if (a.length !== b.length) {
            return false;
        }
        for (var i = 0; i < a.length; i++) {
            if (!_equals(a[i], b[i])) {
                return false;
            }
        }
        return true;
    }
    if (isArrayA !== isArrayB) {
        return false;
    }
    var isDateA = a instanceof Date;
    var isDateB = b instanceof Date;
    if (isDateA && isDateB) {
        return a.getTime() === b.getTime();
    }
    if (isDateA !== isDateB) {
        return false;
    }
    var isRegExpA = a instanceof RegExp;
    var isRegExpB = b instanceof RegExp;
    if (isRegExpA && isRegExpB) {
        return a.toString() === b.toString();
    }
    if (isRegExpA !== isRegExpB) {
        return false;
    }
    var keys = Object.keys(a);
    if (keys.length !== Object.keys(b).length) {
        return false;
    }
    for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
        var key = keys_1[_i];
        if (!Object.prototype.hasOwnProperty.call(b, key)) {
            return false;
        }
        if (!_equals(a[key], b[key])) {
            return false;
        }
    }
    return true;
}
