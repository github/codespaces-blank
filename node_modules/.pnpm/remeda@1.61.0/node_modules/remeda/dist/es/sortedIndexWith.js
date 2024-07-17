import { purry } from "./purry";
import { _binarySearchCutoffIndex } from "./_binarySearchCutoffIndex";
export function sortedIndexWith() {
    return purry(_binarySearchCutoffIndex, arguments);
}
(function (sortedIndexWith) {
    function indexed() {
        return purry(_binarySearchCutoffIndex, arguments);
    }
    sortedIndexWith.indexed = indexed;
})(sortedIndexWith || (sortedIndexWith = {}));
