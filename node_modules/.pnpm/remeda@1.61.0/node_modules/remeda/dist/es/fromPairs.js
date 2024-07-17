import { purry } from "./purry";
export function fromPairs() {
    return purry(fromPairsImplementation, arguments);
}
function fromPairsImplementation(entries) {
    var out = {};
    for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
        var _a = entries_1[_i], key = _a[0], value = _a[1];
        out[key] = value;
    }
    return out;
}
(function (fromPairs) {
    fromPairs.strict = fromPairs;
})(fromPairs || (fromPairs = {}));
