import { purry } from "./purry";
export function forEachObj() {
    return purry(_forEachObj(false), arguments);
}
var _forEachObj = function (indexed) {
    return function (data, fn) {
        for (var key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                var _a = data, _b = key, val = _a[_b];
                if (indexed) {
                    fn(val, key, data);
                }
                else {
                    fn(val);
                }
            }
        }
        return data;
    };
};
(function (forEachObj) {
    function indexed() {
        return purry(_forEachObj(true), arguments);
    }
    forEachObj.indexed = indexed;
})(forEachObj || (forEachObj = {}));
