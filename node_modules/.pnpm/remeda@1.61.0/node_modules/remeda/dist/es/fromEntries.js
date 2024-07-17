import { purry } from "./purry";
export function fromEntries() {
    return purry(fromEntriesImplementation, arguments);
}
function fromEntriesImplementation(entries) {
    var out = {};
    for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
        var _a = entries_1[_i], key = _a[0], value = _a[1];
        out[key] = value;
    }
    return out;
}
(function (fromEntries) {
    fromEntries.strict = fromEntries;
})(fromEntries || (fromEntries = {}));
