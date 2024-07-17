import { _reduceLazy } from "./_reduceLazy";
import { purry } from "./purry";
export function unique() {
    return purry(uniqueImplementation, arguments, unique.lazy);
}
function uniqueImplementation(array) {
    return _reduceLazy(array, unique.lazy());
}
(function (unique) {
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
    unique.lazy = lazy;
})(unique || (unique = {}));
