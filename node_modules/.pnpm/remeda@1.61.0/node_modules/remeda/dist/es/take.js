import { _reduceLazy } from "./_reduceLazy";
import { purry } from "./purry";
export function take() {
    return purry(_take, arguments, take.lazy);
}
function _take(array, n) {
    return _reduceLazy(array, take.lazy(n));
}
(function (take) {
    function lazy(n) {
        if (n <= 0) {
            return function () { return ({ done: true, hasNext: false }); };
        }
        var remaining = n;
        return function (value) {
            remaining -= 1;
            return { done: remaining <= 0, hasNext: true, next: value };
        };
    }
    take.lazy = lazy;
})(take || (take = {}));
