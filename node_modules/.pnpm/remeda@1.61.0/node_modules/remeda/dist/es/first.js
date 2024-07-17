import { purry } from "./purry";
export function first() {
    return purry(_first, arguments, first.lazy);
}
function _first(_a) {
    var item = _a[0];
    return item;
}
(function (first) {
    function lazy() {
        return function (value) { return ({ done: true, hasNext: true, next: value }); };
    }
    first.lazy = lazy;
    (function (lazy) {
        lazy.single = true;
    })(lazy = first.lazy || (first.lazy = {}));
})(first || (first = {}));
