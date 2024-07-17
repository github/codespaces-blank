import { purry } from "./purry";
export function anyPass() {
    return purry(_anyPass, arguments);
}
function _anyPass(data, fns) {
    return fns.some(function (fn) { return fn(data); });
}
