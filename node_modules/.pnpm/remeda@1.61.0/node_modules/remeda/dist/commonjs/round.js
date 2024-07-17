"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.round = void 0;
var _withPrecision_1 = require("./_withPrecision");
var purry_1 = require("./purry");
function round() {
    return (0, purry_1.purry)((0, _withPrecision_1._withPrecision)(Math.round), arguments);
}
exports.round = round;
