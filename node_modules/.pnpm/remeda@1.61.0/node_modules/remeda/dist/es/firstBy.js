import { purryOrderRules } from "./_purryOrderRules";
import { hasAtLeast } from "./hasAtLeast";
export function firstBy() {
    return purryOrderRules(firstByImplementation, arguments);
}
function firstByImplementation(data, compareFn) {
    if (!hasAtLeast(data, 2)) {
        return data[0];
    }
    var currentFirst = data[0];
    var rest = data.slice(1);
    for (var _i = 0, rest_1 = rest; _i < rest_1.length; _i++) {
        var item = rest_1[_i];
        if (compareFn(item, currentFirst) < 0) {
            currentFirst = item;
        }
    }
    return currentFirst;
}
