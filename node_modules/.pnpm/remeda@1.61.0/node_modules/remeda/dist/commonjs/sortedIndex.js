"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortedIndex = void 0;
var purry_1 = require("./purry");
var _binarySearchCutoffIndex_1 = require("./_binarySearchCutoffIndex");
function sortedIndex() {
    return (0, purry_1.purry)(sortedIndexImplementation, arguments);
}
exports.sortedIndex = sortedIndex;
var sortedIndexImplementation = function (array, item) { return (0, _binarySearchCutoffIndex_1._binarySearchCutoffIndex)(array, function (pivot) { return pivot < item; }); };
