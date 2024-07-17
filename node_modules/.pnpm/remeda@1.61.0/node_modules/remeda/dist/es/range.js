import { purry } from "./purry";
export function range() {
    return purry(_range, arguments);
}
function _range(start, end) {
    var ret = [];
    for (var i = start; i < end; i++) {
        ret.push(i);
    }
    return ret;
}
