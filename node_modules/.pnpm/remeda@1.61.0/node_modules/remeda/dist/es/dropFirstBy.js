import { heapify, heapMaybeInsert } from "./_heap";
import { purryOrderRulesWithArgument } from "./_purryOrderRules";
export function dropFirstBy() {
    return purryOrderRulesWithArgument(dropFirstByImplementation, arguments);
}
function dropFirstByImplementation(data, compareFn, n) {
    if (n >= data.length) {
        return [];
    }
    if (n <= 0) {
        return data.slice();
    }
    var heap = data.slice(0, n);
    heapify(heap, compareFn);
    var out = [];
    var rest = data.slice(n);
    for (var _i = 0, rest_1 = rest; _i < rest_1.length; _i++) {
        var item = rest_1[_i];
        var previousHead = heapMaybeInsert(heap, compareFn, item);
        out.push(previousHead !== null && previousHead !== void 0 ? previousHead : item);
    }
    return out;
}
