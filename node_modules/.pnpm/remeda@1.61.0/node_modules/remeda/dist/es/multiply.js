import { purry } from "./purry";
export function multiply() {
    return purry(_multiply, arguments);
}
function _multiply(value, multiplicand) {
    return value * multiplicand;
}
