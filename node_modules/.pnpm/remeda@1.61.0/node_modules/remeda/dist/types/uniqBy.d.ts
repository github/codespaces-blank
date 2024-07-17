/**
 * Returns a new array containing only one copy of each element in the original list transformed by a function.
 * Elements are compared by reference using Set.
 *
 * ! **DEPRECATED**: Use `R.uniqueBy(array, fn)`. Will be removed in V2!
 *
 * @param array - The array to filter.
 * @param transformer
 * @signature
 *    R.uniqBy(array, fn)
 * @example
 *    R.uniqBy(
 *     [{ n: 1 }, { n: 2 }, { n: 2 }, { n: 5 }, { n: 1 }, { n: 6 }, { n: 7 }],
 *     (obj) => obj.n,
 *    ) // => [{n: 1}, {n: 2}, {n: 5}, {n: 6}, {n: 7}]
 * @dataFirst
 * @pipeable
 * @category Deprecated
 * @deprecated Use `R.uniqueBy(array, fn)`. Will be removed in V2!
 */
export declare function uniqBy<T, K>(array: ReadonlyArray<T>, transformer: (item: T) => K): Array<T>;
/**
 * Returns a new array containing only one copy of each element in the original list transformed by a function.
 * Elements are compared by reference using Set.
 *
 * ! **DEPRECATED**: Use `R.uniqueBy(fn)`. Will be removed in V2!
 *
 * @param array - The array to filter.
 * @param transformer
 * @signature
 *    R.uniqBy(fn)(array)
 * @example
 *    R.pipe(
 *      [{n: 1}, {n: 2}, {n: 2}, {n: 5}, {n: 1}, {n: 6}, {n: 7}], // only 4 iterations
 *      R.uniqBy(obj => obj.n),
 *      R.take(3)
 *    ) // => [{n: 1}, {n: 2}, {n: 5}]
 * @dataLast
 * @pipeable
 * @category Deprecated
 * @deprecated Use `R.uniqueBy(fn)`. Will be removed in V2!
 */
export declare function uniqBy<T, K>(transformer: (item: T) => K): (array: ReadonlyArray<T>) => Array<T>;
//# sourceMappingURL=uniqBy.d.ts.map