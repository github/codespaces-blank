import type { Pred, PredIndexed } from "./_types";
/**
 * Returns the value of the last element in the array where predicate is true, and undefined
 * otherwise.
 *
 * @param array - The array.
 * @param fn - The predicate.
 * @signature
 *    R.findLast(items, fn)
 *    R.findLast.indexed(items, fn)
 * @example
 *    R.findLast([1, 3, 4, 6], n => n % 2 === 1) // => 3
 *    R.findLast.indexed([1, 3, 4, 6], (n, i) => n % 2 === 1) // => 3
 * @dataFirst
 * @indexed
 * @pipeable
 * @category Array
 */
export declare function findLast<T>(array: ReadonlyArray<T>, fn: Pred<T, boolean>): T | undefined;
/**
 * Returns the value of the last element in the array where predicate is true, and undefined
 * otherwise.
 *
 * @param fn - The predicate.
 * @signature
 *    R.findLast(fn)(items)
 *    R.findLast.indexed(fn)(items)
 * @example
 *    R.pipe(
 *      [1, 3, 4, 6],
 *      R.findLast(n => n % 2 === 1)
 *    ) // => 3
 *    R.pipe(
 *      [1, 3, 4, 6],
 *      R.findLast.indexed((n, i) => n % 2 === 1)
 *    ) // => 3
 * @dataLast
 * @indexed
 * @pipeable
 * @category Array
 */
export declare function findLast<T = never>(fn: Pred<T, boolean>): (array: ReadonlyArray<T>) => T | undefined;
export declare namespace findLast {
    function indexed<T>(array: ReadonlyArray<T>, fn: PredIndexed<T, boolean>): T | undefined;
    function indexed<T>(fn: PredIndexed<T, boolean>): (array: ReadonlyArray<T>) => T | undefined;
}
//# sourceMappingURL=findLast.d.ts.map