"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.entries = void 0;
var purry_1 = require("./purry");
function entries() {
    return (0, purry_1.purry)(Object.entries, arguments);
}
exports.entries = entries;
(function (entries) {
    entries.strict = entries;
})(entries || (exports.entries = entries = {}));
