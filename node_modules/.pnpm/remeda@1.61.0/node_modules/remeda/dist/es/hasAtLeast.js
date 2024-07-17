import { purry } from "./purry";
export function hasAtLeast() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return purry(hasAtLeastImplementation, args);
}
var hasAtLeastImplementation = function (data, minimum) { return data.length >= minimum; };
