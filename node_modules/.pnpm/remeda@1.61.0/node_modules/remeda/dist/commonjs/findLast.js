"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findLast = void 0;
var purry_1 = require("./purry");
function findLast() {
    return (0, purry_1.purry)(_findLast(false), arguments);
}
exports.findLast = findLast;
var _findLast = function (indexed) {
    return function (array, fn) {
        for (var i = array.length - 1; i >= 0; i--) {
            if (indexed ? fn(array[i], i, array) : fn(array[i])) {
                return array[i];
            }
        }
        return;
    };
};
(function (findLast) {
    function indexed() {
        return (0, purry_1.purry)(_findLast(true), arguments);
    }
    findLast.indexed = indexed;
})(findLast || (exports.findLast = findLast = {}));
