import { purry } from "./purry";
export function dropLastWhile() {
    return purry(_dropLastWhile, arguments);
}
function _dropLastWhile(data, predicate) {
    for (var i = data.length - 1; i >= 0; i--) {
        if (!predicate(data[i])) {
            return data.slice(0, i + 1);
        }
    }
    return [];
}
