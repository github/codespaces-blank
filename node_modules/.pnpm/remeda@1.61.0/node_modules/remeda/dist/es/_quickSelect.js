import { swapInPlace } from "./_swapInPlace";
export var quickSelect = function (data, index, compareFn) {
    return index < 0 || index >= data.length
        ?
            undefined
        : quickSelectImplementation(data.slice(), 0, data.length - 1, index, compareFn);
};
function quickSelectImplementation(data, left, right, index, compareFn) {
    if (left === right) {
        return data[left];
    }
    var pivotIndex = partition(data, left, right, compareFn);
    return index === pivotIndex
        ?
            data[index]
        : quickSelectImplementation(data, index < pivotIndex ? left : pivotIndex + 1, index < pivotIndex ? pivotIndex - 1 : right, index, compareFn);
}
function partition(data, left, right, compareFn) {
    var pivot = data[right];
    var i = left;
    for (var j = left; j < right; j++) {
        if (compareFn(data[j], pivot) < 0) {
            swapInPlace(data, i, j);
            i += 1;
        }
    }
    swapInPlace(data, i, right);
    return i;
}
