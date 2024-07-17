"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromEntries = void 0;
var purry_1 = require("./purry");
function fromEntries() {
    return (0, purry_1.purry)(fromEntriesImplementation, arguments);
}
exports.fromEntries = fromEntries;
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
})(fromEntries || (exports.fromEntries = fromEntries = {}));
