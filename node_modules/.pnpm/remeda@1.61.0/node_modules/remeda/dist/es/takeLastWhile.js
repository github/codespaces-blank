import { purry } from "./purry";
export function takeLastWhile() {
    return purry(_takeLastWhile, arguments);
}
function _takeLastWhile(data, predicate) {
    for (var i = data.length - 1; i >= 0; i--) {
        if (!predicate(data[i])) {
            return data.slice(i + 1);
        }
    }
    return data.slice();
}
