var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { purry } from "./purry";
import { toPairs } from "./toPairs";
export function evolve() {
    return purry(_evolve, arguments);
}
function _evolve(data, evolver) {
    if (typeof data !== "object" || data === null) {
        return data;
    }
    var out = __assign({}, data);
    for (var _i = 0, _a = toPairs.strict(evolver); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], value = _b[1];
        if (key in out) {
            out[key] =
                typeof value === "function"
                    ? value(out[key])
                    : _evolve(out[key], value);
        }
    }
    return out;
}
