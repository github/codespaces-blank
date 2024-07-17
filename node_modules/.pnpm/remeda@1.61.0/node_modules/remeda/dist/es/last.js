import { purry } from "./purry";
export function last() {
    return purry(_last, arguments);
}
function _last(data) {
    return data[data.length - 1];
}
