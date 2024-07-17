"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.flatten = void 0;
var _reduceLazy_1 = require("./_reduceLazy");
var purry_1 = require("./purry");
function flatten() {
    return (0, purry_1.purry)(_flatten, arguments, flatten.lazy);
}
exports.flatten = flatten;
function _flatten(items) {
    return (0, _reduceLazy_1._reduceLazy)(items, flatten.lazy());
}
(function (flatten) {
    flatten.lazy = function () {
        return function (item) {
            return Array.isArray(item)
                ? { done: false, hasNext: true, hasMany: true, next: item }
                : { done: false, hasNext: true, next: item };
        };
    };
})(flatten || (exports.flatten = flatten = {}));
