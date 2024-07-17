import { heapify, heapMaybeInsert } from "./_heap";
import { purryOrderRulesWithArgument } from "./_purryOrderRules";
export function takeFirstBy() {
    return purryOrderRulesWithArgument(takeFirstByImplementation, arguments);
}
function takeFirstByImplementation(data, compareFn, n) {
    if (n <= 0) {
        return [];
    }
    if (n >= data.length) {
        return data.slice();
    }
    var heap = data.slice(0, n);
    heapify(heap, compareFn);
    var rest = data.slice(n);
    for (var _i = 0, rest_1 = rest; _i < rest_1.length; _i++) {
        var item = rest_1[_i];
        heapMaybeInsert(heap, compareFn, item);
    }
    return heap;
}
