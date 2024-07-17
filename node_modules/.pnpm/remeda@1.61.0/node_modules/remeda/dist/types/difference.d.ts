import type { LazyEvaluator } from "./pipe";
/**
 * Excludes the values from `other` array. The output maintains the same order
 * as the input. If either `array` or `other` contain multiple items with the
 * same values, all occurrences of those values will be removed. If the exact
 * number of copies should be observed (i.e. multi-set semantics), use
 * `R.difference.multiset` instead. If the arrays don't contain duplicates, both
 * implementations yield the same result.
 *
 * ! **DEPRECATED**: Use `R.difference.multiset(data, other)` (or `R.filter(data, R.isNot(R.isIncludedIn(other)))` to keep the current runtime logic). `R.difference.multiset` will replace `R.difference` in v2!
 *
 * @param data - The input items.
 * @param other - The values to exclude.
 * @signature
 *    R.difference(data, other)
 *    R.difference.multiset(data, other)
 * @example
 *    R.difference([1, 2, 3, 4], [2, 5, 3]); // => [1, 4]
 *    R.difference([1, 1, 2, 2], [1]); // => [2, 2]
 *    R.difference.multiset([1, 1, 2, 2], [1]); // => [1, 2, 2]
 * @dataFirst
 * @pipeable
 * @category Array
 * @deprecated Use `R.difference.multiset(data, other)` (or `R.filter(data, R.isNot(R.isIncludedIn(other)))` to keep the current runtime logic). `R.difference.multiset` will replace `R.difference` in v2!
 */
export declare function difference<T>(data: ReadonlyArray<T>, other: ReadonlyArray<T>): Array<T>;
/**
 * Excludes the values from `other` array. The output maintains the same order
 * as the input. If either `array` or `other` contain multiple items with the
 * same values, all occurrences of those values will be removed. If the exact
 * number of copies should be observed (i.e. multi-set semantics), use
 * `R.difference.multiset` instead. If the arrays don't contain duplicates, both
 * implementations yield the same result.
 *
 * ! **DEPRECATED**: Use `R.difference.multiset(other)` (or `R.filter(R.isNot(R.isIncludedIn(other)))` to keep the current runtime logic). `R.difference.multiset` will replace `R.difference` in v2!
 *
 * @param other - The values to exclude.
 * @signature
 *    R.difference(other)(data)
 *    R.difference.multiset(other)(data)
 * @example
 *    R.pipe([1, 2, 3, 4], R.difference([2, 5, 3])); // => [1, 4]
 *    R.pipe([1, 1, 2, 2], R.difference([1])); // => [2, 2]
 *    R.pipe([1, 1, 2, 2], R.difference.multiset([1])); // => [1, 2, 2]
 * @dataFirst
 * @pipeable
 * @category Array
 * @deprecated Use `R.difference.multiset(other)` (or `R.filter(R.isNot(R.isIncludedIn(other)))` to keep the current runtime logic). `R.difference.multiset` will replace `R.difference` in v2!
 */
export declare function difference<T, K>(other: ReadonlyArray<T>): (array: ReadonlyArray<K>) => Array<T>;
export declare namespace difference {
    function lazy<T>(other: ReadonlyArray<T>): LazyEvaluator<T>;
    function multiset<T>(array: ReadonlyArray<T>, other: ReadonlyArray<T>): Array<T>;
    function multiset<T>(other: ReadonlyArray<T>): (data: ReadonlyArray<T>) => Array<T>;
}
//# sourceMappingURL=difference.d.ts.map