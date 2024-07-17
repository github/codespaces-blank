import type { LazyEvaluator } from "./pipe";
/**
 * Returns a list of elements that exist in both array. The output maintains the
 * same order as the input. If either `array` or `other` contain multiple items
 * with the same values, all occurrences of those values will be present. If the
 * exact number of copies should be observed (i.e. multi-set semantics), use
 * `R.intersection.multiset` instead. If the arrays don't contain duplicates,
 * both implementations yield the same result.
 *
 * ! **DEPRECATED**: Use `R.intersection.multiset(data, other)` (or `R.filter(data, R.isIncludedIn(other))` to keep the current runtime logic). `R.intersection.multiset` will replace `R.intersection` in v2!
 *
 * @param data - The input items.
 * @param other - The items to compare against.
 * @signature
 *    R.intersection(data, other)
 *    R.intersection.multiset(data, other)
 * @example
 *    R.intersection([1, 2, 3], [2, 3, 5]); // => [2, 3]
 *    R.intersection([1, 1, 2, 2], [1]); // => [1, 1]
 *    R.intersection.multiset([1, 1, 2, 2], [1]); // => [1]
 * @dataFirst
 * @pipeable
 * @category Array
 * @deprecated Use `R.intersection.multiset(data, other)` (or `R.filter(data, R.isIncludedIn(other))` to keep the current runtime logic). `R.intersection.multiset` will replace `R.intersection` in v2!
 */
export declare function intersection<T>(data: ReadonlyArray<T>, other: ReadonlyArray<T>): Array<T>;
/**
 * Returns a list of elements that exist in both array. The output maintains the
 * same order as the input. If either `array` or `other` contain multiple items
 * with the same values, all occurrences of those values will be present. If the
 * exact number of copies should be observed (i.e. multi-set semantics), use
 * `R.intersection.multiset` instead. If the arrays don't contain duplicates,
 * both implementations yield the same result.
 *
 * ! **DEPRECATED**: Use `R.intersection.multiset(other)` (or `R.filter(R.isIncludedIn(other))` to keep the current runtime logic). `R.intersection.multiset` will replace `R.intersection` in v2!
 *
 * @param other - The items to compare against.
 * @signature
 *    R.intersection(other)(data)
 *    R.intersection.multiset(other)(data)
 * @example
 *    R.pipe([1, 2, 3], R.intersection([2, 3, 5])); // => [2, 3]
 *    R.pipe([1, 1, 2, 2], R.intersection([1])); // => [1, 1]
 *    R.pipe([1, 1, 2, 2], R.intersection.multiset([1])); // => [1]
 * @dataFirst
 * @pipeable
 * @category Array
 * @deprecated Use `R.intersection.multiset(other)` (or `R.filter(R.isIncludedIn(other))` to keep the current runtime logic). `R.intersection.multiset` will replace `R.intersection` in v2!
 */
export declare function intersection<T, K>(other: ReadonlyArray<T>): (source: ReadonlyArray<K>) => Array<T>;
export declare namespace intersection {
    function lazy<T>(other: ReadonlyArray<T>): LazyEvaluator<T>;
    function multiset<T, S>(array: ReadonlyArray<T>, other: ReadonlyArray<S>): Array<S & T>;
    function multiset<S>(other: ReadonlyArray<S>): <T>(data: ReadonlyArray<T>) => Array<S & T>;
}
//# sourceMappingURL=intersection.d.ts.map