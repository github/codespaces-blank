import { purry } from "./purry";
export function length() {
    return purry(_length, arguments);
}
function _length(items) {
    return "length" in items ? items.length : Array.from(items).length;
}
