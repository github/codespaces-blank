import { purry } from "./purry";
export function mapToObj() {
    return purry(_mapToObj(false), arguments);
}
var _mapToObj = function (indexed) {
    return function (array, fn) {
        var out = {};
        for (var index = 0; index < array.length; index++) {
            var element = array[index];
            var _a = indexed ? fn(element, index, array) : fn(element), key = _a[0], value = _a[1];
            out[key] = value;
        }
        return out;
    };
};
(function (mapToObj) {
    function indexed() {
        return purry(_mapToObj(true), arguments);
    }
    mapToObj.indexed = indexed;
})(mapToObj || (mapToObj = {}));
