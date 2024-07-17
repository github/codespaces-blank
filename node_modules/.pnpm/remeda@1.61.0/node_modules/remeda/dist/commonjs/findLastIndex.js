"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findLastIndex = void 0;
var purry_1 = require("./purry");
function findLastIndex() {
    return (0, purry_1.purry)(_findLastIndex(false), arguments);
}
exports.findLastIndex = findLastIndex;
var _findLastIndex = function (indexed) {
    return function (array, fn) {
        for (var i = array.length - 1; i >= 0; i--) {
            if (indexed ? fn(array[i], i, array) : fn(array[i])) {
                return i;
            }
        }
        return -1;
    };
};
(function (findLastIndex) {
    function indexed() {
        return (0, purry_1.purry)(_findLastIndex(true), arguments);
    }
    findLastIndex.indexed = indexed;
})(findLastIndex || (exports.findLastIndex = findLastIndex = {}));
