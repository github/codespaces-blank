"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortedIndexWith = void 0;
var purry_1 = require("./purry");
var _binarySearchCutoffIndex_1 = require("./_binarySearchCutoffIndex");
function sortedIndexWith() {
    return (0, purry_1.purry)(_binarySearchCutoffIndex_1._binarySearchCutoffIndex, arguments);
}
exports.sortedIndexWith = sortedIndexWith;
(function (sortedIndexWith) {
    function indexed() {
        return (0, purry_1.purry)(_binarySearchCutoffIndex_1._binarySearchCutoffIndex, arguments);
    }
    sortedIndexWith.indexed = indexed;
})(sortedIndexWith || (exports.sortedIndexWith = sortedIndexWith = {}));
