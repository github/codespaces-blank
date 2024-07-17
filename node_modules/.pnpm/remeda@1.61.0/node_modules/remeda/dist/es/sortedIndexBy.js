import { purry } from "./purry";
import { _binarySearchCutoffIndex } from "./_binarySearchCutoffIndex";
export function sortedIndexBy() {
    return purry(sortedIndexByImplementation, arguments);
}
(function (sortedIndexBy) {
    function indexed() {
        return purry(sortedIndexByImplementation, arguments);
    }
    sortedIndexBy.indexed = indexed;
})(sortedIndexBy || (sortedIndexBy = {}));
function sortedIndexByImplementation(array, item, valueFunction) {
    var value = valueFunction(item);
    return _binarySearchCutoffIndex(array, function (pivot, index) { return valueFunction(pivot, index) < value; });
}
