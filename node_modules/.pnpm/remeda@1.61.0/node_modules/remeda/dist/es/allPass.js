import { purry } from "./purry";
export function allPass() {
    return purry(_allPass, arguments);
}
function _allPass(data, fns) {
    return fns.every(function (fn) { return fn(data); });
}
