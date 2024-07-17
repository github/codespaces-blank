import { purry } from "./purry";
export function flatMapToObj() {
    return purry(_flatMapToObj(false), arguments);
}
var _flatMapToObj = function (indexed) {
    return function (array, fn) {
        var out = {};
        for (var index = 0; index < array.length; index++) {
            var element = array[index];
            var items = indexed ? fn(element, index, array) : fn(element);
            for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
                var _a = items_1[_i], key = _a[0], value = _a[1];
                out[key] = value;
            }
        }
        return out;
    };
};
(function (flatMapToObj) {
    function indexed() {
        return purry(_flatMapToObj(true), arguments);
    }
    flatMapToObj.indexed = indexed;
})(flatMapToObj || (flatMapToObj = {}));
