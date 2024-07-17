import { purry } from "./purry";
export function only() {
    return purry(_only, arguments);
}
function _only(array) {
    return array.length === 1 ? array[0] : undefined;
}
