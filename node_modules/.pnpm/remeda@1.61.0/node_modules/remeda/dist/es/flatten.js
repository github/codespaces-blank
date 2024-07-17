import { _reduceLazy } from "./_reduceLazy";
import { purry } from "./purry";
export function flatten() {
    return purry(_flatten, arguments, flatten.lazy);
}
function _flatten(items) {
    return _reduceLazy(items, flatten.lazy());
}
(function (flatten) {
    flatten.lazy = function () {
        return function (item) {
            return Array.isArray(item)
                ? { done: false, hasNext: true, hasMany: true, next: item }
                : { done: false, hasNext: true, next: item };
        };
    };
})(flatten || (flatten = {}));
