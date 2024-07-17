import { purry } from "./purry";
import { _binarySearchCutoffIndex } from "./_binarySearchCutoffIndex";
export function sortedLastIndex() {
    return purry(sortedLastIndexImplementation, arguments);
}
var sortedLastIndexImplementation = function (array, item) {
    return _binarySearchCutoffIndex(array, function (pivot) { return pivot <= item; });
};
