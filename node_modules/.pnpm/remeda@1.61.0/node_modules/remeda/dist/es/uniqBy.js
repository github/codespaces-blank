import { _reduceLazy } from "./_reduceLazy";
import { purry } from "./purry";
export function uniqBy() {
    return purry(_uniqBy, arguments, lazyUniqBy);
}
function _uniqBy(array, transformer) {
    return _reduceLazy(array, lazyUniqBy(transformer));
}
function lazyUniqBy(transformer) {
    var set = new Set();
    return function (value) {
        var appliedItem = transformer(value);
        if (set.has(appliedItem)) {
            return { done: false, hasNext: false };
        }
        set.add(appliedItem);
        return { done: false, hasNext: true, next: value };
    };
}
