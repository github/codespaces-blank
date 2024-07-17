import { purry } from "./purry";
var _minBy = function (indexed) {
    return function (array, fn) {
        var ret;
        var retMin;
        for (var index = 0; index < array.length; index++) {
            var item = array[index];
            var min = indexed ? fn(item, index, array) : fn(item);
            if (retMin === undefined || min < retMin) {
                ret = item;
                retMin = min;
            }
        }
        return ret;
    };
};
export function minBy() {
    return purry(_minBy(false), arguments);
}
(function (minBy) {
    function indexed() {
        return purry(_minBy(true), arguments);
    }
    minBy.indexed = indexed;
})(minBy || (minBy = {}));
