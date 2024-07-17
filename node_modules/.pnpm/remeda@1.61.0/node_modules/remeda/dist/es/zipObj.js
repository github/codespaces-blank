import { purry } from "./purry";
export function zipObj() {
    return purry(_zipObj, arguments);
}
function _zipObj(first, second) {
    var resultLength = first.length > second.length ? second.length : first.length;
    var result = {};
    for (var i = 0; i < resultLength; i++) {
        result[first[i]] = second[i];
    }
    return result;
}
