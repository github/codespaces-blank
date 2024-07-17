import { purry } from "./purry";
export function reverse() {
    return purry(_reverse, arguments);
}
function _reverse(array) {
    return array.slice().reverse();
}
