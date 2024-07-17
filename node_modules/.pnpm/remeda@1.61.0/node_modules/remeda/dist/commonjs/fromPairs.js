"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromPairs = void 0;
var purry_1 = require("./purry");
function fromPairs() {
    return (0, purry_1.purry)(fromPairsImplementation, arguments);
}
exports.fromPairs = fromPairs;
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
})(fromPairs || (exports.fromPairs = fromPairs = {}));
