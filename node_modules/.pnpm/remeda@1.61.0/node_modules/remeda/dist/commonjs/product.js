"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.product = void 0;
var purry_1 = require("./purry");
function product() {
    return (0, purry_1.purry)(productImplementation, arguments);
}
exports.product = product;
function productImplementation(data) {
    var out = 1;
    for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
        var value = data_1[_i];
        out *= value;
    }
    return out;
}
