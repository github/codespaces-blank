import { purry } from "./purry";
import { toPairs } from "./toPairs";
export function mapValues() {
    return purry(_mapValues, arguments);
}
function _mapValues(data, fn) {
    var out = {};
    for (var _i = 0, _a = toPairs.strict(data); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], value = _b[1];
        var mappedValue = fn(value, key);
        out[key] = mappedValue;
    }
    return out;
}
