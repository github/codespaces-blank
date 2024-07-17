import { purry } from "./purry";
export function times() {
    return purry(_times, arguments);
}
function _times(count, fn) {
    if (count < 0) {
        throw new RangeError("n must be a non-negative number");
    }
    var res = [];
    for (var i = 0; i < count; i++) {
        res.push(fn(i));
    }
    return res;
}
