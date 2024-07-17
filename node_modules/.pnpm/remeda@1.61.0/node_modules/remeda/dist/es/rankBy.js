import { purryOrderRulesWithArgument } from "./_purryOrderRules";
export function rankBy() {
    return purryOrderRulesWithArgument(rankByImplementation, arguments);
}
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
