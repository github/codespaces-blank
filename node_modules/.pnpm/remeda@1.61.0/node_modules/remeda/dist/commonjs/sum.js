"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sum = void 0;
var purry_1 = require("./purry");
function sum() {
    return (0, purry_1.purry)(sumImplementation, arguments);
}
exports.sum = sum;
function sumImplementation(data) {
    var out = 0;
    for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
        var value = data_1[_i];
        out += value;
    }
    return out;
}
