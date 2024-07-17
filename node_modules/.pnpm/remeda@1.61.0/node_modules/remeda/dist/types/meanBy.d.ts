import type { PredIndexed } from "./_types";
/**
 * Returns the mean of the elements of an array using the provided predicate.
 *
 * @param fn - Predicate function.
 * @signature
 *   R.meanBy(fn)(array)
 *   R.meanBy.indexed(fn)(array)
 * @example
 *    R.pipe(
 *      [{a: 5}, {a: 1}, {a: 3}],
 *      R.meanBy(x => x.a)
 *    ) // 3
 * @dataLast
 * @indexed
 * @category Array
 */
export declare function meanBy<T>(fn: (item: T) => number): (items: ReadonlyArray<T>) => number;
/**
 * Returns the mean of the elements of an array using the provided predicate.
 *
 * @param items - The array.
 * @param fn - Predicate function.
 * @signature
 *   R.meanBy(array, fn)
 *   R.meanBy.indexed(array, fn)
 * @example
 *    R.meanBy(
 *      [{a: 5}, {a: 1}, {a: 3}],
 *      x => x.a
 *    ) // 3
 * @dataFirst
 * @indexed
 * @category Array
 */
export declare function meanBy<T>(items: ReadonlyArray<T>, fn: (item: T) => number): number;
export declare namespace meanBy {
    function indexed<T>(array: ReadonlyArray<T>, fn: PredIndexed<T, number>): number;
    function indexed<T>(fn: PredIndexed<T, number>): (array: ReadonlyArray<T>) => number;
}
//# sourceMappingURL=meanBy.d.ts.map