import { purry } from "./purry";
export function keys() {
    return purry(Object.keys, arguments);
}
(function (keys) {
    keys.strict = keys;
})(keys || (keys = {}));
