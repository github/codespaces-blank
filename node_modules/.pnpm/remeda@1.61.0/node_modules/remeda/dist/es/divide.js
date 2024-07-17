import { purry } from "./purry";
export function divide() {
    return purry(_divide, arguments);
}
function _divide(value, divisor) {
    return value / divisor;
}
