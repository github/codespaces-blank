import { purry } from "./purry";
import { _binarySearchCutoffIndex } from "./_binarySearchCutoffIndex";
export function sortedLastIndexBy() {
    return purry(sortedLastIndexByImplementation, arguments);
}
(function (sortedLastIndexBy) {
    function indexed() {
        return purry(sortedLastIndexByImplementation, arguments);
    }
    sortedLastIndexBy.indexed = indexed;
})(sortedLastIndexBy || (sortedLastIndexBy = {}));
function sortedLastIndexByImplementation(array, item, valueFunction) {
    var value = valueFunction(item);
    return _binarySearchCutoffIndex(array, function (pivot, index) { return valueFunction(pivot, index) <= value; });
}
