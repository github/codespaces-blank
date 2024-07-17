/**
 * Splits a given array at the first index where the given predicate returns true.
 *
 * @param array - The array to split.
 * @param fn - The predicate.
 * @signature
 *    R.splitWhen(array, fn)
 * @example
 *    R.splitWhen([1, 2, 3], x => x === 2) // => [[1], [2, 3]]
 * @dataFirst
 * @category Array
 */
export declare function splitWhen<T>(array: ReadonlyArray<T>, fn: (item: T) => boolean): [Array<T>, Array<T>];
/**
 * Splits a given array at an index where the given predicate returns true.
 *
 * @param fn - The predicate.
 * @signature
 *    R.splitWhen(fn)(array)
 * @example
 *    R.splitWhen(x => x === 2)([1, 2, 3]) // => [[1], [2, 3]]
 * @dataLast
 * @category Array
 */
export declare function splitWhen<T>(fn: (item: T) => boolean): (array: ReadonlyArray<T>) => [Array<T>, Array<T>];
//# sourceMappingURL=splitWhen.d.ts.map