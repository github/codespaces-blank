import type { Pred, PredIndexed, PredIndexedOptional } from "./_types";
import type { LazyEvaluator } from "./pipe";
/**
 * Returns the value of the first element in the array where predicate is true, and undefined otherwise.
 *
 * @param array - The array.
 * @param fn - The predicate.
 * @signature
 *    R.find(items, fn)
 *    R.find.indexed(items, fn)
 * @example
 *    R.find([1, 3, 4, 6], n => n % 2 === 0) // => 4
 *    R.find.indexed([1, 3, 4, 6], (n, i) => n % 2 === 0) // => 4
 * @dataFirst
 * @indexed
 * @pipeable
 * @category Array
 */
export declare function find<T>(array: ReadonlyArray<T>, fn: Pred<T, boolean>): T | undefined;
/**
 * Returns the value of the first element in the array where predicate is true, and undefined otherwise.
 *
 * @param fn - The predicate.
 * @signature
 *    R.find(fn)(items)
 *    R.find.indexed(fn)(items)
 * @example
 *    R.pipe(
 *      [1, 3, 4, 6],
 *      R.find(n => n % 2 === 0)
 *    ) // => 4
 *    R.pipe(
 *      [1, 3, 4, 6],
 *      R.find.indexed((n, i) => n % 2 === 0)
 *    ) // => 4
 * @dataLast
 * @indexed
 * @pipeable
 * @category Array
 */
export declare function find<T = never>(fn: Pred<T, boolean>): (array: ReadonlyArray<T>) => T | undefined;
export declare namespace find {
    function indexed<T>(array: ReadonlyArray<T>, fn: PredIndexed<T, boolean>): T | undefined;
    function indexed<T>(fn: PredIndexed<T, boolean>): (array: ReadonlyArray<T>) => T | undefined;
    const lazy: (<T>(fn: PredIndexedOptional<T, boolean>) => LazyEvaluator<T>) & {
        readonly single: true;
    };
    const lazyIndexed: (<T>(fn: PredIndexedOptional<T, boolean>) => LazyEvaluator<T>) & {
        readonly indexed: true;
    } & {
        readonly single: true;
    };
}
//# sourceMappingURL=find.d.ts.map