import { purryOrderRules } from "./_purryOrderRules";
export function sortBy() {
    return purryOrderRules(_sortBy, arguments);
}
var _sortBy = function (data, compareFn) {
    return data.slice().sort(compareFn);
};
(function (sortBy) {
    sortBy.strict = sortBy;
})(sortBy || (sortBy = {}));
