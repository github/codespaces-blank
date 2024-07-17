import { keys } from "./keys";
import { purry } from "./purry";
export function omitBy() {
    return purry(_omitBy, arguments);
}
function _omitBy(object, fn) {
    if (object === undefined || object === null) {
        return object;
    }
    var out = {};
    for (var _i = 0, _a = keys.strict(object); _i < _a.length; _i++) {
        var key = _a[_i];
        if (!fn(object[key], key)) {
            out[key] = object[key];
        }
    }
    return out;
}
