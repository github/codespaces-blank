"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toPairs = void 0;
var purry_1 = require("./purry");
function toPairs() {
    return (0, purry_1.purry)(Object.entries, arguments);
}
exports.toPairs = toPairs;
(function (toPairs) {
    toPairs.strict = toPairs;
})(toPairs || (exports.toPairs = toPairs = {}));
