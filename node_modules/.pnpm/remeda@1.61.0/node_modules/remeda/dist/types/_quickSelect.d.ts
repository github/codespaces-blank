/**
 * A simple implementation of the *QuickSelect* algorithm.
 *
 * @see https://en.wikipedia.org/wiki/Quickselect
 */
import type { CompareFunction } from "./_types";
/**
 * Perform QuickSelect on the given data. Notice that the data would be cloned
 * shallowly so that it could be mutated in-place, and then discarded once the
 * algorithm is done. This means that running this function multiple times on
 * the same array might be slower then sorting the array before.
 *
 * @param data - The data to perform the selection on.
 * @param index - The index of the item we are looking for.
 * @param compareFn - The compare function to use for sorting.
 * @returns The item at the given index, or `undefined` if the index is out-of-
 * bounds.
 */
export declare const quickSelect: <T>(data: ReadonlyArray<T>, index: number, compareFn: CompareFunction<T>) => T | undefined;
//# sourceMappingURL=_quickSelect.d.ts.map