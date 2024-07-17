import type { Pred, PredIndexed, PredIndexedOptional } from "./_types";
import type { LazyEvaluator } from "./pipe";
/**
 * Filter the elements of an array that meet the condition specified in a callback function.
 *
 * @param array - The array to filter.
 * @param fn - The callback function.
 * @signature
 *    R.filter(array, fn)
 *    R.filter.indexed(array, fn)
 * @example
 *    R.filter([1, 2, 3], x => x % 2 === 1) // => [1, 3]
 *    R.filter.indexed([1, 2, 3], (x, i, array) => x % 2 === 1) // => [1, 3]
 * @dataFirst
 * @indexed
 * @pipeable
 * @category Array
 */
export declare function filter<T, S extends T>(array: ReadonlyArray<T>, fn: (value: T) => value is S): Array<S>;
export declare function filter<T>(array: ReadonlyArray<T>, fn: Pred<T, boolean>): Array<T>;
/**
 * Filter the elements of an array that meet the condition specified in a callback function.
 *
 * @param fn - The callback function.
 * @signature
 *    R.filter(fn)(array)
 *    R.filter.indexed(fn)(array)
 * @example
 *    R.pipe([1, 2, 3], R.filter(x => x % 2 === 1)) // => [1, 3]
 *    R.pipe([1, 2, 3], R.filter.indexed((x, i) => x % 2 === 1)) // => [1, 3]
 * @dataLast
 * @indexed
 * @pipeable
 * @category Array
 */
export declare function filter<T, S extends T>(fn: (input: T) => input is S): (array: ReadonlyArray<T>) => Array<S>;
export declare function filter<T>(fn: Pred<T, boolean>): (array: ReadonlyArray<T>) => Array<T>;
export declare namespace filter {
    function indexed<T, S extends T>(array: ReadonlyArray<T>, fn: (input: T, index: number, array: ReadonlyArray<T>) => input is S): Array<S>;
    function indexed<T>(array: ReadonlyArray<T>, fn: PredIndexed<T, boolean>): Array<T>;
    function indexed<T, S extends T>(fn: (input: T, index: number, array: ReadonlyArray<T>) => input is S): (array: ReadonlyArray<T>) => Array<S>;
    function indexed<T>(fn: PredIndexed<T, boolean>): (array: ReadonlyArray<T>) => Array<T>;
    const lazy: <T>(fn: PredIndexedOptional<T, boolean>) => LazyEvaluator<T>;
    const lazyIndexed: (<T>(fn: PredIndexedOptional<T, boolean>) => LazyEvaluator<T>) & {
        readonly indexed: true;
    };
}
//# sourceMappingURL=filter.d.ts.map