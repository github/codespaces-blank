import { purry } from "./purry";
export function findLast() {
    return purry(_findLast(false), arguments);
}
var _findLast = function (indexed) {
    return function (array, fn) {
        for (var i = array.length - 1; i >= 0; i--) {
            if (indexed ? fn(array[i], i, array) : fn(array[i])) {
                return array[i];
            }
        }
        return;
    };
};
(function (findLast) {
    function indexed() {
        return purry(_findLast(true), arguments);
    }
    findLast.indexed = indexed;
})(findLast || (findLast = {}));
