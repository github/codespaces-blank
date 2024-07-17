"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unique = void 0;
var _reduceLazy_1 = require("./_reduceLazy");
var purry_1 = require("./purry");
function unique() {
    return (0, purry_1.purry)(uniqueImplementation, arguments, unique.lazy);
}
exports.unique = unique;
function uniqueImplementation(array) {
    return (0, _reduceLazy_1._reduceLazy)(array, unique.lazy());
}
(function (unique) {
    function lazy() {
        var set = new Set();
        return function (value) {
            if (set.has(value)) {
                return { done: false, hasNext: false };
            }
            set.add(value);
            return { done: false, hasNext: true, next: value };
        };
    }
    unique.lazy = lazy;
})(unique || (exports.unique = unique = {}));
