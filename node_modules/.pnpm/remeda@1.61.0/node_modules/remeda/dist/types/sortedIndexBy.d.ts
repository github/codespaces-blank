/**
 * Find the insertion position (index) of an item in an array with items sorted
 * in ascending order using a value function; so that `splice(sortedIndex, 0, item)`
 * would result in maintaining the arrays sort-ness. The array can contain
 * duplicates.
 * If the item already exists in the array the index would be of the *first*
 * occurrence of the item.
 *
 * Runs in O(logN) time.
 *
 * @param data - The (ascending) sorted array.
 * @param item - The item to insert.
 * @param valueFunction - All comparisons would be performed on the result of
 * calling this function on each compared item. Preferably this function should
 * return a `number` or `string`. This function should be the same as the one
 * provided to sortBy to sort the array.
 * @returns Insertion index (In the range 0..data.length).
 * @signature
 *    R.sortedIndexBy(data, item, valueFunction)
 * @example
 *    R.sortedIndexBy([{age:20},{age:22}],{age:21},prop('age')) // => 1
 * @dataFirst
 * @indexed
 * @category Array
 * @see sortedIndex, sortedIndexWith, sortedLastIndex, sortedLastIndexBy
 */
export declare function sortedIndexBy<T>(data: ReadonlyArray<T>, item: T, valueFunction: (item: T) => NonNullable<unknown>): number;
/**
 * Find the insertion position (index) of an item in an array with items sorted
 * in ascending order using a value function; so that `splice(sortedIndex, 0, item)`
 * would result in maintaining the arrays sort-ness. The array can contain
 * duplicates.
 * If the item already exists in the array the index would be of the *first*
 * occurrence of the item.
 *
 * Runs in O(logN) time.
 *
 * @param item - The item to insert.
 * @param valueFunction - All comparisons would be performed on the result of
 * calling this function on each compared item. Preferably this function should
 * return a `number` or `string`. This function should be the same as the one
 * provided to sortBy to sort the array.
 * @returns Insertion index (In the range 0..data.length).
 * @signature
 *    R.sortedIndexBy(data, item, valueFunction)
 * @example
 *    R.sortedIndexBy([{age:20},{age:22}],{age:21},prop('age')) // => 1
 * @dataLast
 * @indexed
 * @category Array
 * @see sortedIndex, sortedIndexWith, sortedLastIndex, sortedLastIndexBy
 */
export declare function sortedIndexBy<T>(item: T, valueFunction: (item: T) => NonNullable<unknown>): (data: ReadonlyArray<T>) => number;
export declare namespace sortedIndexBy {
    function indexed<T>(data: ReadonlyArray<T>, item: T, valueFunction: (item: T, index?: number) => NonNullable<unknown>): number;
    function indexed<T>(item: T, valueFunction: (item: T, index?: number) => NonNullable<unknown>): (data: ReadonlyArray<T>) => number;
}
//# sourceMappingURL=sortedIndexBy.d.ts.map