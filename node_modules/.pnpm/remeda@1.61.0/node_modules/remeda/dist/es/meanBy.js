import { purry } from "./purry";
var _meanBy = function (indexed) {
    return function (array, fn) {
        if (array.length === 0) {
            return NaN;
        }
        var sum = 0;
        for (var index = 0; index < array.length; index++) {
            var item = array[index];
            sum += indexed ? fn(item, index, array) : fn(item);
        }
        return sum / array.length;
    };
};
export function meanBy() {
    return purry(_meanBy(false), arguments);
}
(function (meanBy) {
    function indexed() {
        return purry(_meanBy(true), arguments);
    }
    meanBy.indexed = indexed;
})(meanBy || (meanBy = {}));
