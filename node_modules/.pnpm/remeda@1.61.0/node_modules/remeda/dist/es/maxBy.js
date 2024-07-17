import { purry } from "./purry";
var _maxBy = function (indexed) {
    return function (array, fn) {
        var ret;
        var retMax;
        for (var index = 0; index < array.length; index++) {
            var item = array[index];
            var max = indexed ? fn(item, index, array) : fn(item);
            if (retMax === undefined || max > retMax) {
                ret = item;
                retMax = max;
            }
        }
        return ret;
    };
};
export function maxBy() {
    return purry(_maxBy(false), arguments);
}
(function (maxBy) {
    function indexed() {
        return purry(_maxBy(true), arguments);
    }
    maxBy.indexed = indexed;
})(maxBy || (maxBy = {}));
