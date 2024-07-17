import { purry } from "./purry";
export function subtract() {
    return purry(_subtract, arguments);
}
function _subtract(value, subtrahend) {
    return value - subtrahend;
}
