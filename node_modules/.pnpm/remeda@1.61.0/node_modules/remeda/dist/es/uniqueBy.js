import { _reduceLazy } from "./_reduceLazy";
import { purry } from "./purry";
export function uniqueBy() {
    return purry(uniqueByImplementation, arguments, lazyUniqueBy);
}
function uniqueByImplementation(data, keyFunction) {
    return _reduceLazy(data, lazyUniqueBy(keyFunction));
}
function lazyUniqueBy(keyFunction) {
    var set = new Set();
    return function (value) {
        var key = keyFunction(value);
        if (set.has(key)) {
            return { done: false, hasNext: false };
        }
        set.add(key);
        return { done: false, hasNext: true, next: value };
    };
}
