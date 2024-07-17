"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.minBy = void 0;
var purry_1 = require("./purry");
var _minBy = function (indexed) {
    return function (array, fn) {
        var ret;
        var retMin;
        for (var index = 0; index < array.length; index++) {
            var item = array[index];
            var min = indexed ? fn(item, index, array) : fn(item);
            if (retMin === undefined || min < retMin) {
                ret = item;
                retMin = min;
            }
        }
        return ret;
    };
};
function minBy() {
    return (0, purry_1.purry)(_minBy(false), arguments);
}
exports.minBy = minBy;
(function (minBy) {
    function indexed() {
        return (0, purry_1.purry)(_minBy(true), arguments);
    }
    minBy.indexed = indexed;
})(minBy || (exports.minBy = minBy = {}));
