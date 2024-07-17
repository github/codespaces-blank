import { purry } from "./purry";
export function pick() {
    return purry(_pick, arguments);
}
function _pick(object, names) {
    var out = {};
    for (var _i = 0, names_1 = names; _i < names_1.length; _i++) {
        var name_1 = names_1[_i];
        if (name_1 in object) {
            out[name_1] = object[name_1];
        }
    }
    return out;
}
