import { splitAt } from "./splitAt";
import { purry } from "./purry";
export function splitWhen() {
    return purry(_splitWhen, arguments);
}
function _splitWhen(array, fn) {
    for (var i = 0; i < array.length; i++) {
        if (fn(array[i])) {
            return splitAt(array, i);
        }
    }
    return [array.slice(), []];
}
