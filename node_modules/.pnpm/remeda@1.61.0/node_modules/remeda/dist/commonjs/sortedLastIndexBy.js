"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortedLastIndexBy = void 0;
var purry_1 = require("./purry");
var _binarySearchCutoffIndex_1 = require("./_binarySearchCutoffIndex");
function sortedLastIndexBy() {
    return (0, purry_1.purry)(sortedLastIndexByImplementation, arguments);
}
exports.sortedLastIndexBy = sortedLastIndexBy;
(function (sortedLastIndexBy) {
    function indexed() {
        return (0, purry_1.purry)(sortedLastIndexByImplementation, arguments);
    }
    sortedLastIndexBy.indexed = indexed;
})(sortedLastIndexBy || (exports.sortedLastIndexBy = sortedLastIndexBy = {}));
function sortedLastIndexByImplementation(array, item, valueFunction) {
    var value = valueFunction(item);
    return (0, _binarySearchCutoffIndex_1._binarySearchCutoffIndex)(array, function (pivot, index) { return valueFunction(pivot, index) <= value; });
}
