import { purry } from "./purry";
export function dropWhile() {
    return purry(_dropWhile, arguments);
}
function _dropWhile(data, predicate) {
    for (var i = 0; i < data.length; i++) {
        if (!predicate(data[i])) {
            return data.slice(i);
        }
    }
    return [];
}
