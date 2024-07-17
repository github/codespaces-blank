"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uniqueBy = void 0;
var _reduceLazy_1 = require("./_reduceLazy");
var purry_1 = require("./purry");
function uniqueBy() {
    return (0, purry_1.purry)(uniqueByImplementation, arguments, lazyUniqueBy);
}
exports.uniqueBy = uniqueBy;
function uniqueByImplementation(data, keyFunction) {
    return (0, _reduceLazy_1._reduceLazy)(data, lazyUniqueBy(keyFunction));
}
function lazyUniqueBy(keyFunction) {
    var set = new Set();
    return function (value) {
        var key = keyFunction(value);
        if (set.has(key)) {
            return { done: false, hasNext: false };
        }
        set.add(key);
        return { done: false, hasNext: true, next: value };
    };
}
