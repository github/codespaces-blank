"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.firstBy = void 0;
var _purryOrderRules_1 = require("./_purryOrderRules");
var hasAtLeast_1 = require("./hasAtLeast");
function firstBy() {
    return (0, _purryOrderRules_1.purryOrderRules)(firstByImplementation, arguments);
}
exports.firstBy = firstBy;
function firstByImplementation(data, compareFn) {
    if (!(0, hasAtLeast_1.hasAtLeast)(data, 2)) {
        return data[0];
    }
    var currentFirst = data[0];
    var rest = data.slice(1);
    for (var _i = 0, rest_1 = rest; _i < rest_1.length; _i++) {
        var item = rest_1[_i];
        if (compareFn(item, currentFirst) < 0) {
            currentFirst = item;
        }
    }
    return currentFirst;
}
