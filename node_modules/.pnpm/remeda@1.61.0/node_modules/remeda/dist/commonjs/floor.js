"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.floor = void 0;
var _withPrecision_1 = require("./_withPrecision");
var purry_1 = require("./purry");
function floor() {
    return (0, purry_1.purry)((0, _withPrecision_1._withPrecision)(Math.floor), arguments);
}
exports.floor = floor;
