import { purry } from "./purry";
export function entries() {
    return purry(Object.entries, arguments);
}
(function (entries) {
    entries.strict = entries;
})(entries || (entries = {}));
