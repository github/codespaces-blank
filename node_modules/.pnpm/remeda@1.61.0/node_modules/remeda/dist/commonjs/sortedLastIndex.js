"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortedLastIndex = void 0;
var purry_1 = require("./purry");
var _binarySearchCutoffIndex_1 = require("./_binarySearchCutoffIndex");
function sortedLastIndex() {
    return (0, purry_1.purry)(sortedLastIndexImplementation, arguments);
}
exports.sortedLastIndex = sortedLastIndex;
var sortedLastIndexImplementation = function (array, item) {
    return (0, _binarySearchCutoffIndex_1._binarySearchCutoffIndex)(array, function (pivot) { return pivot <= item; });
};
