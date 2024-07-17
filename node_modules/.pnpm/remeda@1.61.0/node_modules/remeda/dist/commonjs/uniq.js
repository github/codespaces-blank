"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uniq = void 0;
var _reduceLazy_1 = require("./_reduceLazy");
var purry_1 = require("./purry");
function uniq() {
    return (0, purry_1.purry)(_uniq, arguments, uniq.lazy);
}
exports.uniq = uniq;
function _uniq(array) {
    return (0, _reduceLazy_1._reduceLazy)(array, uniq.lazy());
}
(function (uniq) {
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
    uniq.lazy = lazy;
})(uniq || (exports.uniq = uniq = {}));
