import { purry } from "./purry";
import { toPairs } from "./toPairs";
export function mapKeys() {
    return purry(_mapKeys, arguments);
}
function _mapKeys(data, fn) {
    var out = {};
    for (var _i = 0, _a = toPairs.strict(data); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], value = _b[1];
        out[fn(key, value)] = value;
    }
    return out;
}
