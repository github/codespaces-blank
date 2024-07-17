import { purry } from "./purry";
export function tap() {
    return purry(_tap, arguments);
}
function _tap(value, fn) {
    fn(value);
    return value;
}
