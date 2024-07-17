import { purryOrderRulesWithArgument } from "./_purryOrderRules";
import { quickSelect } from "./_quickSelect";
export function nthBy() {
    return purryOrderRulesWithArgument(nthByImplementation, arguments);
}
var nthByImplementation = function (data, compareFn, index) {
    return quickSelect(data, index >= 0 ? index : data.length + index, compareFn);
};
