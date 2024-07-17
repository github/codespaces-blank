"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.swapInPlace = void 0;
function swapInPlace(data, i, j) {
    var _a;
    _a = [data[j], data[i]], data[i] = _a[0], data[j] = _a[1];
}
exports.swapInPlace = swapInPlace;
