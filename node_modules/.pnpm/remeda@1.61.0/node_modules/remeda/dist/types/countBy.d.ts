import type { Pred, PredIndexed } from "./_types";
/**
 * Counts how many values of the collection pass the specified predicate.
 *
 * ! **DEPRECATED**: Use `R.filter(items, fn).length`. Will be removed in v2!
 *
 * @param items - The input data.
 * @param fn - The predicate.
 * @signature
 *    R.countBy(array, fn)
 * @example
 *    R.countBy([1, 2, 3, 4, 5], x => x % 2 === 0) // => 2
 * @dataFirst
 * @indexed
 * @category Deprecated
 * @deprecated Use `R.filter(items, fn).length`. Will be removed in v2.
 */
export declare function countBy<T>(items: ReadonlyArray<T>, fn: Pred<T, boolean>): number;
/**
 * Counts how many values of the collection pass the specified predicate.
 *
 * ! **DEPRECATED**: Use `<T>(items: ReadonlyArray<T>) => R.filter(items, fn).length` or if in a pipe: `R.pipe(..., R.filter(fn), R.length(), ...)`. Will be removed in v2!
 *
 * @param fn - The predicate.
 * @signature
 *    R.countBy(fn)(array)
 * @example
 *    R.pipe([1, 2, 3, 4, 5], R.countBy(x => x % 2 === 0)) // => 2
 * @dataLast
 * @indexed
 * @category Deprecated
 * @deprecated Use `<T>(items: ReadonlyArray<T>) => R.filter(items, fn).length` or if in a pipe: `R.pipe(..., R.filter(fn), R.length(), ...)`. Will be removed in v2.
 */
export declare function countBy<T>(fn: Pred<T, boolean>): (array: ReadonlyArray<T>) => number;
export declare namespace countBy {
    /**
     * Counts how many values of the collection pass the specified predicate.
     *
     * ! **DEPRECATED**: Use `R.filter.indexed(items, fn).length`. Will be removed in v2!
     *
     * @example
     *    R.pipe([1, 2, 3, 4, 5], R.countBy(x => x % 2 === 0)) // => 2
     * @deprecated Use `R.filter.indexed(items, fn).length`. Will be removed in v2.
     */
    function indexed<T>(array: ReadonlyArray<T>, fn: PredIndexed<T, boolean>): number;
    /**
     * Counts how many values of the collection pass the specified predicate.
     *
     * ! **DEPRECATED**: Use `<T>(items: ReadonlyArray<T>) => R.filter.indexed(items, fn).length` or if in a pipe: `R.pipe(..., R.filter.indexed(fn), R.length(), ...)`. Will be removed in v2!
     *
     * @example
     *    R.pipe([1, 2, 3, 4, 5], R.countBy(x => x % 2 === 0)) // => 2
     * @deprecated Use `<T>(items: ReadonlyArray<T>) => R.filter.indexed(items, fn).length` or if in a pipe: `R.pipe(..., R.filter.indexed(fn), R.length(), ...)`. Will be removed in v2.
     */
    function indexed<T>(fn: PredIndexed<T, boolean>): (array: ReadonlyArray<T>) => number;
}
//# sourceMappingURL=countBy.d.ts.map