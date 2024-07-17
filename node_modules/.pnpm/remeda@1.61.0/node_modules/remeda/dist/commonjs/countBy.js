"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.countBy = void 0;
var purry_1 = require("./purry");
var _countBy = function (indexed) {
    return function (array, fn) {
        var out = 0;
        for (var index = 0; index < array.length; index++) {
            var item = array[index];
            var value = indexed ? fn(item, index, array) : fn(item);
            out += value ? 1 : 0;
        }
        return out;
    };
};
function countBy() {
    return (0, purry_1.purry)(_countBy(false), arguments);
}
exports.countBy = countBy;
(function (countBy) {
    function indexed() {
        return (0, purry_1.purry)(_countBy(true), arguments);
    }
    countBy.indexed = indexed;
})(countBy || (exports.countBy = countBy = {}));
