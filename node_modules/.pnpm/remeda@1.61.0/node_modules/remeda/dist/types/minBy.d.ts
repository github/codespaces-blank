import type { PredIndexed } from "./_types";
/**
 * Returns the min element using the provided predicate.
 *
 * ! **DEPRECATED**: Use `R.firstBy(fn)`. Will be removed in V2!
 *
 * @param fn - The predicate.
 * @signature
 *    R.minBy(fn)(array)
 *    R.minBy.indexed(fn)(array)
 * @example
 *    R.pipe(
 *      [{a: 5}, {a: 1}, {a: 3}],
 *      R.minBy(x => x.a)
 *    ) // { a: 1 }
 * @dataLast
 * @indexed
 * @category Deprecated
 * @deprecated Use `R.firstBy(fn)`. Will be removed in V2!
 */
export declare function minBy<T>(fn: (item: T) => number): (items: ReadonlyArray<T>) => T | undefined;
/**
 * Returns the min element using the provided predicate.
 *
 * ! **DEPRECATED**: Use `R.firstBy(items, fn)`. Will be removed in V2!
 *
 * @param items - The array.
 * @param fn - The predicate.
 * @signature
 *    R.minBy(array, fn)
 *    R.minBy.indexed(array, fn)
 * @example
 *    R.minBy(
 *      [{a: 5}, {a: 1}, {a: 3}],
 *      x => x.a
 *    ) // { a: 1 }
 * @dataFirst
 * @indexed
 * @category Deprecated
 * @deprecated Use `R.firstBy(items, fn)`. Will be removed in V2!
 */
export declare function minBy<T>(items: ReadonlyArray<T>, fn: (item: T) => number): T | undefined;
export declare namespace minBy {
    function indexed<T>(array: ReadonlyArray<T>, fn: PredIndexed<T, number>): T | undefined;
    function indexed<T>(fn: PredIndexed<T, number>): (array: ReadonlyArray<T>) => T | undefined;
}
//# sourceMappingURL=minBy.d.ts.map