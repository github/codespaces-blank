"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reduce = void 0;
var purry_1 = require("./purry");
function reduce() {
    return (0, purry_1.purry)(_reduce(false), arguments);
}
exports.reduce = reduce;
var _reduce = function (indexed) {
    return function (items, fn, initialValue) {
        return items.reduce(function (acc, item, index) {
            return indexed ? fn(acc, item, index, items) : fn(acc, item);
        }, initialValue);
    };
};
(function (reduce) {
    function indexed() {
        return (0, purry_1.purry)(_reduce(true), arguments);
    }
    reduce.indexed = indexed;
})(reduce || (exports.reduce = reduce = {}));
