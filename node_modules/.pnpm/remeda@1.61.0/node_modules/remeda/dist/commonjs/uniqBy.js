"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uniqBy = void 0;
var _reduceLazy_1 = require("./_reduceLazy");
var purry_1 = require("./purry");
function uniqBy() {
    return (0, purry_1.purry)(_uniqBy, arguments, lazyUniqBy);
}
exports.uniqBy = uniqBy;
function _uniqBy(array, transformer) {
    return (0, _reduceLazy_1._reduceLazy)(array, lazyUniqBy(transformer));
}
function lazyUniqBy(transformer) {
    var set = new Set();
    return function (value) {
        var appliedItem = transformer(value);
        if (set.has(appliedItem)) {
            return { done: false, hasNext: false };
        }
        set.add(appliedItem);
        return { done: false, hasNext: true, next: value };
    };
}
