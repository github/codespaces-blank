import type { PredIndexed } from "./_types";
/**
 * Returns the sum of the elements of an array using the provided predicate.
 *
 * @param fn - Predicate function.
 * @signature
 *   R.sumBy(fn)(array)
 *   R.sumBy.indexed(fn)(array)
 * @example
 *    R.pipe(
 *      [{a: 5}, {a: 1}, {a: 3}],
 *      R.sumBy(x => x.a)
 *    ) // 9
 * @dataLast
 * @indexed
 * @category Array
 */
export declare function sumBy<T>(fn: (item: T) => number): (items: ReadonlyArray<T>) => number;
/**
 * Returns the sum of the elements of an array using the provided predicate.
 *
 * @param items - The array.
 * @param fn - Predicate function.
 * @signature
 *   R.sumBy(array, fn)
 *   R.sumBy.indexed(array, fn)
 * @example
 *    R.sumBy(
 *      [{a: 5}, {a: 1}, {a: 3}],
 *      x => x.a
 *    ) // 9
 * @dataFirst
 * @indexed
 * @category Array
 */
export declare function sumBy<T>(items: ReadonlyArray<T>, fn: (item: T) => number): number;
export declare namespace sumBy {
    function indexed<T>(array: ReadonlyArray<T>, fn: PredIndexed<T, number>): number;
    function indexed<T>(fn: PredIndexed<T, number>): (array: ReadonlyArray<T>) => number;
}
//# sourceMappingURL=sumBy.d.ts.map