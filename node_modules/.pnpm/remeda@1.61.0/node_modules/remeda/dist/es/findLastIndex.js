import { purry } from "./purry";
export function findLastIndex() {
    return purry(_findLastIndex(false), arguments);
}
var _findLastIndex = function (indexed) {
    return function (array, fn) {
        for (var i = array.length - 1; i >= 0; i--) {
            if (indexed ? fn(array[i], i, array) : fn(array[i])) {
                return i;
            }
        }
        return -1;
    };
};
(function (findLastIndex) {
    function indexed() {
        return purry(_findLastIndex(true), arguments);
    }
    findLastIndex.indexed = indexed;
})(findLastIndex || (findLastIndex = {}));
