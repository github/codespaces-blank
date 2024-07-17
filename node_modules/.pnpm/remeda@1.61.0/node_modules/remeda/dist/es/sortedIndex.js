import { purry } from "./purry";
import { _binarySearchCutoffIndex } from "./_binarySearchCutoffIndex";
export function sortedIndex() {
    return purry(sortedIndexImplementation, arguments);
}
var sortedIndexImplementation = function (array, item) { return _binarySearchCutoffIndex(array, function (pivot) { return pivot < item; }); };
