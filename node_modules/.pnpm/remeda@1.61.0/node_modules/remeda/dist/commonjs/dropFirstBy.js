"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dropFirstBy = void 0;
var _heap_1 = require("./_heap");
var _purryOrderRules_1 = require("./_purryOrderRules");
function dropFirstBy() {
    return (0, _purryOrderRules_1.purryOrderRulesWithArgument)(dropFirstByImplementation, arguments);
}
exports.dropFirstBy = dropFirstBy;
function dropFirstByImplementation(data, compareFn, n) {
    if (n >= data.length) {
        return [];
    }
    if (n <= 0) {
        return data.slice();
    }
    var heap = data.slice(0, n);
    (0, _heap_1.heapify)(heap, compareFn);
    var out = [];
    var rest = data.slice(n);
    for (var _i = 0, rest_1 = rest; _i < rest_1.length; _i++) {
        var item = rest_1[_i];
        var previousHead = (0, _heap_1.heapMaybeInsert)(heap, compareFn, item);
        out.push(previousHead !== null && previousHead !== void 0 ? previousHead : item);
    }
    return out;
}
