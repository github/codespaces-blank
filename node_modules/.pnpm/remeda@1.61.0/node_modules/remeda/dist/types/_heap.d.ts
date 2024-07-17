/**
 * Heap related utilities.
 */
import type { CompareFunction } from "./_types";
/**
 * Mutates an array into a "max"-heap based on `compareFn` so that for any `item` in the heap, `compareFn(heap[0], item) > 0`.
 *
 * @param heap - The array to be heapified. The array would be mutated!
 * @param compareFn - The comparator used to order items in the heap. Use the
 * same function in all calls mutating the same heap otherwise you'd get
 * unexpected results.
 */
export declare function heapify<T>(heap: Array<T>, compareFn: CompareFunction<T>): void;
/**
 * Insert an item into a heap if it's "smaller" (in regards to `compareFn`) than
 * the current head of the heap (which is the "largest" value in the heap). If
 * the item is inserted, the previous head of the heap is returned, otherwise
 * `undefined` is returned and the heap is unchanged.
 *
 * @param heap - A *mutable* array representing a heap (see `heapify`).
 * @param compareFn - The comparator used to order items in the heap. Use the.
 * @param item - The item to be inserted into the heap.
 * @returns `undefined` if the heap is unchanged, or the previous head of the
 * heap if the item was inserted.
 */
export declare function heapMaybeInsert<T>(heap: Array<T>, compareFn: CompareFunction<T>, item: T): T | undefined;
//# sourceMappingURL=_heap.d.ts.map