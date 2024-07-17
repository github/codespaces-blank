"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.keys = void 0;
var purry_1 = require("./purry");
function keys() {
    return (0, purry_1.purry)(Object.keys, arguments);
}
exports.keys = keys;
(function (keys) {
    keys.strict = keys;
})(keys || (exports.keys = keys = {}));
