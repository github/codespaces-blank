import { purry } from "./purry";
export function add() {
    return purry(_add, arguments);
}
function _add(value, addend) {
    return value + addend;
}
