import { purry } from "./purry";
export function invert() {
    return purry(_invert, arguments);
}
function _invert(object) {
    var result = {};
    for (var key in object) {
        if (Object.prototype.hasOwnProperty.call(object, key)) {
            result[object[key]] = key;
        }
    }
    return result;
}
