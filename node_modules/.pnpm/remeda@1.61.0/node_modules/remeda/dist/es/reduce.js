import { purry } from "./purry";
export function reduce() {
    return purry(_reduce(false), arguments);
}
var _reduce = function (indexed) {
    return function (items, fn, initialValue) {
        return items.reduce(function (acc, item, index) {
            return indexed ? fn(acc, item, index, items) : fn(acc, item);
        }, initialValue);
    };
};
(function (reduce) {
    function indexed() {
        return purry(_reduce(true), arguments);
    }
    reduce.indexed = indexed;
})(reduce || (reduce = {}));
