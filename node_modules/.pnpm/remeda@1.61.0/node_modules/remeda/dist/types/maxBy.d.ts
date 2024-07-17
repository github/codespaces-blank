import type { PredIndexed } from "./_types";
/**
 * Returns the max element using the provided predicate.
 *
 * ! **DEPRECATED**: Use `R.firstBy([fn, "desc"])`. Will be removed in V2!
 *
 * @param fn - The predicate.
 * @signature
 *    R.maxBy(fn)(array)
 *    R.maxBy.indexed(fn)(array)
 * @example
 *    R.pipe(
 *      [{a: 5}, {a: 1}, {a: 3}],
 *      R.maxBy(x => x.a)
 *    ) // { a: 5 }
 * @dataLast
 * @indexed
 * @category Deprecated
 * @deprecated Use `R.firstBy([fn, "desc"])`. Will be removed in V2!
 */
export declare function maxBy<T>(fn: (item: T) => number): (items: ReadonlyArray<T>) => T | undefined;
/**
 * Returns the max element using the provided predicate.
 *
 * ! **DEPRECATED**: Use `R.firstBy(items, fn)`. Will be removed in V2!
 *
 * @param items - The array.
 * @param fn - The predicate.
 * @signature
 *    R.maxBy(array, fn)
 *    R.maxBy.indexed(array, fn)
 * @example
 *    R.maxBy(
 *      [{a: 5}, {a: 1}, {a: 3}],
 *      x => x.a
 *    ) // { a: 5 }
 * @dataFirst
 * @indexed
 * @category Deprecated
 * @deprecated Use `R.firstBy(items, [fn, "desc"])`. Will be removed in V2!
 */
export declare function maxBy<T>(items: ReadonlyArray<T>, fn: (item: T) => number): T | undefined;
export declare namespace maxBy {
    function indexed<T>(array: ReadonlyArray<T>, fn: PredIndexed<T, number>): T | undefined;
    function indexed<T>(fn: PredIndexed<T, number>): (array: ReadonlyArray<T>) => T | undefined;
}
//# sourceMappingURL=maxBy.d.ts.map