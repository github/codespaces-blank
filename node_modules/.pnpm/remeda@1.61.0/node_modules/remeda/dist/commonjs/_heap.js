"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.heapMaybeInsert = exports.heapify = void 0;
var _swapInPlace_1 = require("./_swapInPlace");
var hasAtLeast_1 = require("./hasAtLeast");
function heapify(heap, compareFn) {
    for (var i = Math.floor(heap.length / 2) - 1; i >= 0; i--) {
        heapSiftDown(heap, i, compareFn);
    }
}
exports.heapify = heapify;
function heapMaybeInsert(heap, compareFn, item) {
    if (!(0, hasAtLeast_1.hasAtLeast)(heap, 1)) {
        return;
    }
    var head = heap[0];
    if (compareFn(item, head) >= 0) {
        return;
    }
    heap[0] = item;
    heapSiftDown(heap, 0, compareFn);
    return head;
}
exports.heapMaybeInsert = heapMaybeInsert;
function heapSiftDown(heap, index, compareFn) {
    var currentIndex = index;
    while (currentIndex * 2 + 1 < heap.length) {
        var firstChildIndex = currentIndex * 2 + 1;
        var swapIndex = compareFn(heap[currentIndex], heap[firstChildIndex]) < 0
            ?
                firstChildIndex
            : currentIndex;
        var secondChildIndex = firstChildIndex + 1;
        if (secondChildIndex < heap.length &&
            compareFn(heap[swapIndex], heap[secondChildIndex]) < 0) {
            swapIndex = secondChildIndex;
        }
        if (swapIndex === currentIndex) {
            return;
        }
        (0, _swapInPlace_1.swapInPlace)(heap, currentIndex, swapIndex);
        currentIndex = swapIndex;
    }
}
