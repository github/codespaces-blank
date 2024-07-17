"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.takeFirstBy = void 0;
var _heap_1 = require("./_heap");
var _purryOrderRules_1 = require("./_purryOrderRules");
function takeFirstBy() {
    return (0, _purryOrderRules_1.purryOrderRulesWithArgument)(takeFirstByImplementation, arguments);
}
exports.takeFirstBy = takeFirstBy;
function takeFirstByImplementation(data, compareFn, n) {
    if (n <= 0) {
        return [];
    }
    if (n >= data.length) {
        return data.slice();
    }
    var heap = data.slice(0, n);
    (0, _heap_1.heapify)(heap, compareFn);
    var rest = data.slice(n);
    for (var _i = 0, rest_1 = rest; _i < rest_1.length; _i++) {
        var item = rest_1[_i];
        (0, _heap_1.heapMaybeInsert)(heap, compareFn, item);
    }
    return heap;
}
