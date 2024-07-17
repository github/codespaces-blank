import { purry } from "./purry";
export function objOf() {
    return purry(_objOf, arguments);
}
function _objOf(value, key) {
    var _a;
    return _a = {}, _a[key] = value, _a;
}
