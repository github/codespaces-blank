"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortBy = void 0;
var _purryOrderRules_1 = require("./_purryOrderRules");
function sortBy() {
    return (0, _purryOrderRules_1.purryOrderRules)(_sortBy, arguments);
}
exports.sortBy = sortBy;
var _sortBy = function (data, compareFn) {
    return data.slice().sort(compareFn);
};
(function (sortBy) {
    sortBy.strict = sortBy;
})(sortBy || (exports.sortBy = sortBy = {}));
