import { purry } from "./purry";
export function toPairs() {
    return purry(Object.entries, arguments);
}
(function (toPairs) {
    toPairs.strict = toPairs;
})(toPairs || (toPairs = {}));
