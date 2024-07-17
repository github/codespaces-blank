import { purry } from "./purry";
export function chunk() {
    return purry(_chunk, arguments);
}
function _chunk(array, size) {
    var ret = [];
    for (var offset = 0; offset < array.length; offset += size) {
        ret.push(array.slice(offset, offset + size));
    }
    return ret;
}
