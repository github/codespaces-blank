import { purry } from "./purry";
export function sort() {
    return purry(_sort, arguments);
}
function _sort(items, cmp) {
    var ret = items.slice();
    ret.sort(cmp);
    return ret;
}
(function (sort) {
    sort.strict = sort;
})(sort || (sort = {}));
