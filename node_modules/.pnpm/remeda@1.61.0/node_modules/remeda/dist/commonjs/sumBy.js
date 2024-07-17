"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sumBy = void 0;
var purry_1 = require("./purry");
var _sumBy = function (indexed) {
    return function (array, fn) {
        var sum = 0;
        for (var index = 0; index < array.length; index++) {
            var item = array[index];
            var summand = indexed ? fn(item, index, array) : fn(item);
            sum += summand;
        }
        return sum;
    };
};
function sumBy() {
    return (0, purry_1.purry)(_sumBy(false), arguments);
}
exports.sumBy = sumBy;
(function (sumBy) {
    function indexed() {
        return (0, purry_1.purry)(_sumBy(true), arguments);
    }
    sumBy.indexed = indexed;
})(sumBy || (exports.sumBy = sumBy = {}));
