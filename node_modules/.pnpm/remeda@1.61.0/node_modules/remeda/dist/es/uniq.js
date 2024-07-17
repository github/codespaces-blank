import { _reduceLazy } from "./_reduceLazy";
import { purry } from "./purry";
export function uniq() {
    return purry(_uniq, arguments, uniq.lazy);
}
function _uniq(array) {
    return _reduceLazy(array, uniq.lazy());
}
(function (uniq) {
    function lazy() {
        var set = new Set();
        return function (value) {
            if (set.has(value)) {
                return { done: false, hasNext: false };
            }
            set.add(value);
            return { done: false, hasNext: true, next: value };
        };
    }
    uniq.lazy = lazy;
})(uniq || (uniq = {}));
