import { purry } from "./purry";
export function shuffle() {
    return purry(_shuffle, arguments);
}
function _shuffle(items) {
    var result = items.slice();
    for (var index = 0; index < items.length; index++) {
        var rand = index + Math.floor(Math.random() * (items.length - index));
        var value = result[rand];
        result[rand] = result[index];
        result[index] = value;
    }
    return result;
}
