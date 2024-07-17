"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.values = void 0;
var purry_1 = require("./purry");
function values() {
    return (0, purry_1.purry)(Object.values, arguments);
}
exports.values = values;
