"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.maxBy = void 0;
var purry_1 = require("./purry");
var _maxBy = function (indexed) {
    return function (array, fn) {
        var ret;
        var retMax;
        for (var index = 0; index < array.length; index++) {
            var item = array[index];
            var max = indexed ? fn(item, index, array) : fn(item);
            if (retMax === undefined || max > retMax) {
                ret = item;
                retMax = max;
            }
        }
        return ret;
    };
};
function maxBy() {
    return (0, purry_1.purry)(_maxBy(false), arguments);
}
exports.maxBy = maxBy;
(function (maxBy) {
    function indexed() {
        return (0, purry_1.purry)(_maxBy(true), arguments);
    }
    maxBy.indexed = indexed;
})(maxBy || (exports.maxBy = maxBy = {}));
