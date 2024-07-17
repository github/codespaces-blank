"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.meanBy = void 0;
var purry_1 = require("./purry");
var _meanBy = function (indexed) {
    return function (array, fn) {
        if (array.length === 0) {
            return NaN;
        }
        var sum = 0;
        for (var index = 0; index < array.length; index++) {
            var item = array[index];
            sum += indexed ? fn(item, index, array) : fn(item);
        }
        return sum / array.length;
    };
};
function meanBy() {
    return (0, purry_1.purry)(_meanBy(false), arguments);
}
exports.meanBy = meanBy;
(function (meanBy) {
    function indexed() {
        return (0, purry_1.purry)(_meanBy(true), arguments);
    }
    meanBy.indexed = indexed;
})(meanBy || (exports.meanBy = meanBy = {}));
