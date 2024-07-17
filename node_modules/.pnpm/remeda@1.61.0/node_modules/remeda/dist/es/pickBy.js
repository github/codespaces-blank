import { keys } from "./keys";
import { purry } from "./purry";
export function pickBy() {
    return purry(_pickBy, arguments);
}
function _pickBy(data, fn) {
    if (data === null || data === undefined) {
        return {};
    }
    var out = {};
    for (var _i = 0, _a = keys.strict(data); _i < _a.length; _i++) {
        var key = _a[_i];
        if (fn(data[key], key)) {
            out[key] = data[key];
        }
    }
    return out;
}
