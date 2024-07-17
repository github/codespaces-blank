"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortedIndexBy = void 0;
var purry_1 = require("./purry");
var _binarySearchCutoffIndex_1 = require("./_binarySearchCutoffIndex");
function sortedIndexBy() {
    return (0, purry_1.purry)(sortedIndexByImplementation, arguments);
}
exports.sortedIndexBy = sortedIndexBy;
(function (sortedIndexBy) {
    function indexed() {
        return (0, purry_1.purry)(sortedIndexByImplementation, arguments);
    }
    sortedIndexBy.indexed = indexed;
})(sortedIndexBy || (exports.sortedIndexBy = sortedIndexBy = {}));
function sortedIndexByImplementation(array, item, valueFunction) {
    var value = valueFunction(item);
    return (0, _binarySearchCutoffIndex_1._binarySearchCutoffIndex)(array, function (pivot, index) { return valueFunction(pivot, index) < value; });
}
