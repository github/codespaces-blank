export function _binarySearchCutoffIndex(array, predicate) {
    var lowIndex = 0;
    var highIndex = array.length;
    while (lowIndex < highIndex) {
        var pivotIndex = (lowIndex + highIndex) >>> 1;
        var pivot = array[pivotIndex];
        if (predicate(pivot, pivotIndex)) {
            lowIndex = pivotIndex + 1;
        }
        else {
            highIndex = pivotIndex;
        }
    }
    return highIndex;
}
