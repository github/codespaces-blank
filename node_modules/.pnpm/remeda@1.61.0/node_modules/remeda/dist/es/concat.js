import { purry } from "./purry";
export function concat() {
    return purry(_concat, arguments);
}
function _concat(arr1, arr2) {
    return arr1.concat(arr2);
}
