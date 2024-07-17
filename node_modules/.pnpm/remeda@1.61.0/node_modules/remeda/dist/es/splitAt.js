import { purry } from "./purry";
export function splitAt() {
    return purry(_splitAt, arguments);
}
function _splitAt(array, index) {
    var copy = array.slice();
    var tail = copy.splice(index);
    return [copy, tail];
}
