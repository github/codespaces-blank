import { purry } from "./purry";
export function dropLast() {
    return purry(_dropLast, arguments);
}
function _dropLast(array, n) {
    var copy = array.slice();
    if (n > 0) {
        copy.splice(-n);
    }
    return copy;
}
