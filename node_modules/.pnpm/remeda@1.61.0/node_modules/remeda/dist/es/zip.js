import { purry } from "./purry";
export function zip() {
    return purry(_zip, arguments);
}
function _zip(first, second) {
    var resultLength = first.length > second.length ? second.length : first.length;
    var result = [];
    for (var i = 0; i < resultLength; i++) {
        result.push([first[i], second[i]]);
    }
    return result;
}
(function (zip) {
    zip.strict = zip;
})(zip || (zip = {}));
