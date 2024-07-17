import { purry } from "./purry";
export function swapIndices() {
    return purry(_swapIndices, arguments);
}
function _swapIndices(item, index1, index2) {
    return typeof item === "string"
        ? _swapString(item, index1, index2)
        : _swapArray(item, index1, index2);
}
function _swapArray(item, index1, index2) {
    var result = item.slice();
    if (isNaN(index1) || isNaN(index2)) {
        return result;
    }
    var positiveIndexA = index1 < 0 ? item.length + index1 : index1;
    var positiveIndexB = index2 < 0 ? item.length + index2 : index2;
    if (positiveIndexA < 0 || positiveIndexA > item.length) {
        return result;
    }
    if (positiveIndexB < 0 || positiveIndexB > item.length) {
        return result;
    }
    result[positiveIndexA] = item[positiveIndexB];
    result[positiveIndexB] = item[positiveIndexA];
    return result;
}
function _swapString(item, index1, index2) {
    var result = _swapArray(item.split(""), index1, index2);
    return result.join("");
}
