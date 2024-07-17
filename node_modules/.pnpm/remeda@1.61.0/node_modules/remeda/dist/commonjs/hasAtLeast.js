"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasAtLeast = void 0;
var purry_1 = require("./purry");
function hasAtLeast() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return (0, purry_1.purry)(hasAtLeastImplementation, args);
}
exports.hasAtLeast = hasAtLeast;
var hasAtLeastImplementation = function (data, minimum) { return data.length >= minimum; };
