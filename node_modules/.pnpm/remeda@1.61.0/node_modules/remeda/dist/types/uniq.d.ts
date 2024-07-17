import type { LazyEvaluator } from "./pipe";
/**
 * Returns a new array containing only one copy of each element in the original list.
 * Elements are compared by reference using Set.
 *
 * ! **DEPRECATED**: Use `R.unique(array)`. Will be removed in V2.
 *
 * @param array - The array to filter.
 * @signature
 *    R.uniq(array)
 * @example
 *    R.uniq([1, 2, 2, 5, 1, 6, 7]) // => [1, 2, 5, 6, 7]
 * @dataFirst
 * @pipeable
 * @category Deprecated
 * @deprecated Use `R.unique(array)`. Will be removed in V2.
 */
export declare function uniq<T>(array: ReadonlyArray<T>): Array<T>;
/**
 * Returns a new array containing only one copy of each element in the original list.
 * Elements are compared by reference using Set.
 *
 * ! **DEPRECATED**: Use `R.unique()`. Will be removed in V2.
 *
 * @param array - The array to filter.
 * @signature
 *    R.uniq()(array)
 * @example
 *    R.pipe(
 *      [1, 2, 2, 5, 1, 6, 7], // only 4 iterations
 *      R.uniq(),
 *      R.take(3)
 *    ) // => [1, 2, 5]
 * @dataLast
 * @pipeable
 * @category Deprecated
 * @deprecated Use `R.unique()`. Will be removed in V2.
 */
export declare function uniq<T>(): (array: ReadonlyArray<T>) => Array<T>;
export declare namespace uniq {
    function lazy<T>(): LazyEvaluator<T>;
}
//# sourceMappingURL=uniq.d.ts.map