import { purry } from "./purry";
export function clamp() {
    return purry(_clamp, arguments);
}
function _clamp(value, _a) {
    var min = _a.min, max = _a.max;
    return min !== undefined && value < min
        ? min
        : max !== undefined && value > max
            ? max
            : value;
}
