import { swapInPlace } from "./_swapInPlace";
import { hasAtLeast } from "./hasAtLeast";
export function heapify(heap, compareFn) {
    for (var i = Math.floor(heap.length / 2) - 1; i >= 0; i--) {
        heapSiftDown(heap, i, compareFn);
    }
}
export function heapMaybeInsert(heap, compareFn, item) {
    if (!hasAtLeast(heap, 1)) {
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
        swapInPlace(heap, currentIndex, swapIndex);
        currentIndex = swapIndex;
    }
}
