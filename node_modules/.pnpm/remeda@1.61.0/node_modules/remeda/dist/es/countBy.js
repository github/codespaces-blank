import { purry } from "./purry";
var _countBy = function (indexed) {
    return function (array, fn) {
        var out = 0;
        for (var index = 0; index < array.length; index++) {
            var item = array[index];
            var value = indexed ? fn(item, index, array) : fn(item);
            out += value ? 1 : 0;
        }
        return out;
    };
};
export function countBy() {
    return purry(_countBy(false), arguments);
}
(function (countBy) {
    function indexed() {
        return purry(_countBy(true), arguments);
    }
    countBy.indexed = indexed;
})(countBy || (countBy = {}));
