import type { Pred, PredIndexed, PredIndexedOptional } from "./_types";
import type { LazyEvaluator } from "./pipe";
/**
 * Returns the index of the first element in the array where predicate is true, and -1 otherwise.
 *
 * @param array - The array.
 * @param fn - The predicate.
 * @signature
 *    R.findIndex(items, fn)
 *    R.findIndex.indexed(items, fn)
 * @example
 *    R.findIndex([1, 3, 4, 6], n => n % 2 === 0) // => 2
 *    R.findIndex.indexed([1, 3, 4, 6], (n, i) => n % 2 === 0) // => 2
 * @dataFirst
 * @indexed
 * @pipeable
 * @category Array
 */
export declare function findIndex<T>(array: ReadonlyArray<T>, fn: Pred<T, boolean>): number;
/**
 * Returns the index of the first element in the array where predicate is true, and -1 otherwise.
 *
 * @param fn - The predicate.
 * @signature
 *    R.findIndex(fn)(items)
 *    R.findIndex.indexed(fn)(items)
 * @example
 *    R.pipe(
 *      [1, 3, 4, 6],
 *      R.findIndex(n => n % 2 === 0)
 *    ) // => 2
 *    R.pipe(
 *      [1, 3, 4, 6],
 *      R.findIndex.indexed((n, i) => n % 2 === 0)
 *    ) // => 2
 * @dataLast
 * @indexed
 * @pipeable
 * @category Array
 */
export declare function findIndex<T>(fn: Pred<T, boolean>): (array: ReadonlyArray<T>) => number;
export declare namespace findIndex {
    function indexed<T>(array: ReadonlyArray<T>, fn: PredIndexed<T, boolean>): number;
    function indexed<T>(fn: PredIndexed<T, boolean>): (array: ReadonlyArray<T>) => number;
    const lazy: (<T>(fn: PredIndexedOptional<T, boolean>) => LazyEvaluator<T, number>) & {
        readonly single: true;
    };
    const lazyIndexed: (<T>(fn: PredIndexedOptional<T, boolean>) => LazyEvaluator<T, number>) & {
        readonly indexed: true;
    } & {
        readonly single: true;
    };
}
//# sourceMappingURL=findIndex.d.ts.map