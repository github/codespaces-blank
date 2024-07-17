"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rankBy = void 0;
var _purryOrderRules_1 = require("./_purryOrderRules");
function rankBy() {
    return (0, _purryOrderRules_1.purryOrderRulesWithArgument)(rankByImplementation, arguments);
}
exports.rankBy = rankBy;
function rankByImplementation(data, compareFn, targetItem) {
    var rank = 0;
    for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
        var item = data_1[_i];
        if (compareFn(targetItem, item) > 0) {
            rank += 1;
        }
    }
    return rank;
}
