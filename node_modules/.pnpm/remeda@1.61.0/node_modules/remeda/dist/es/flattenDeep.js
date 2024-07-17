import { _reduceLazy } from "./_reduceLazy";
import { purry } from "./purry";
export function flattenDeep() {
    return purry(_flattenDeep, arguments, flattenDeep.lazy);
}
function _flattenDeep(items) {
    return _reduceLazy(items, flattenDeep.lazy());
}
function _flattenDeepValue(value) {
    if (!Array.isArray(value)) {
        return value;
    }
    var ret = [];
    for (var _i = 0, value_1 = value; _i < value_1.length; _i++) {
        var item = value_1[_i];
        if (Array.isArray(item)) {
            ret.push.apply(ret, flattenDeep(item));
        }
        else {
            ret.push(item);
        }
    }
    return ret;
}
(function (flattenDeep) {
    flattenDeep.lazy = function () {
        return function (value) {
            var next = _flattenDeepValue(value);
            return Array.isArray(next)
                ? { done: false, hasNext: true, hasMany: true, next: next }
                : { done: false, hasNext: true, next: next };
        };
    };
})(flattenDeep || (flattenDeep = {}));
