"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nthBy = void 0;
var _purryOrderRules_1 = require("./_purryOrderRules");
var _quickSelect_1 = require("./_quickSelect");
function nthBy() {
    return (0, _purryOrderRules_1.purryOrderRulesWithArgument)(nthByImplementation, arguments);
}
exports.nthBy = nthBy;
var nthByImplementation = function (data, compareFn, index) {
    return (0, _quickSelect_1.quickSelect)(data, index >= 0 ? index : data.length + index, compareFn);
};
