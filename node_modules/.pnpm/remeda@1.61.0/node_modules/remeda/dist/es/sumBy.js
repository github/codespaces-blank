import { purry } from "./purry";
var _sumBy = function (indexed) {
    return function (array, fn) {
        var sum = 0;
        for (var index = 0; index < array.length; index++) {
            var item = array[index];
            var summand = indexed ? fn(item, index, array) : fn(item);
            sum += summand;
        }
        return sum;
    };
};
export function sumBy() {
    return purry(_sumBy(false), arguments);
}
(function (sumBy) {
    function indexed() {
        return purry(_sumBy(true), arguments);
    }
    sumBy.indexed = indexed;
})(sumBy || (sumBy = {}));
