import type { Pred, PredIndexed, PredIndexedOptional } from "./_types";
import type { LazyEvaluator } from "./pipe";
/**
 * Reject the elements of an array that meet the condition specified in a callback function.
 *
 * ! **DEPRECATED**: Use `R.filter(items, R.isNot(fn))`. Will be removed in V2!
 *
 * @param items - The array to reject.
 * @param fn - The callback function.
 * @signature
 *    R.reject(array, fn)
 *    R.reject.indexed(array, fn)
 * @example
 *    R.reject([1, 2, 3], x => x % 2 === 0) // => [1, 3]
 *    R.reject.indexed([1, 2, 3], (x, i, array) => x % 2 === 0) // => [1, 3]
 * @dataFirst
 * @indexed
 * @pipeable
 * @category Deprecated
 * @deprecated Use `R.filter(items, R.isNot(fn))`. Will be removed in V2!
 */
export declare function reject<T>(items: ReadonlyArray<T>, fn: Pred<T, boolean>): Array<T>;
/**
 * Reject the elements of an array that meet the condition specified in a callback function.
 *
 * ! **DEPRECATED**: Use `R.filter(R.isNot(fn))`. Will be removed in V2!
 *
 * @param items - The array to reject.
 * @param fn - The callback function.
 * @signature
 *    R.reject(array, fn)
 *    R.reject.indexed(array, fn)
 * @example
 *    R.reject([1, 2, 3], x => x % 2 === 0) // => [1, 3]
 *    R.reject.indexed([1, 2, 3], (x, i, array) => x % 2 === 0) // => [1, 3]
 * @dataFirst
 * @indexed
 * @pipeable
 * @category Deprecated
 * @deprecated Use `R.filter(R.isNot(fn))`. Will be removed in V2!
 */
export declare function reject<T>(fn: Pred<T, boolean>): (items: ReadonlyArray<T>) => Array<T>;
export declare namespace reject {
    /**
     * @deprecated Use `R.filter.indexed(items, (item, index, array) => !fn(item, index, array))`. Will be removed in V2!
     */
    function indexed<T, K>(array: ReadonlyArray<T>, fn: PredIndexed<T, boolean>): Array<K>;
    /**
     * @deprecated Use `R.filter.indexed((item, index, array) => !fn(item, index, array))`. Will be removed in V2!
     */
    function indexed<T, K>(fn: PredIndexed<T, boolean>): (array: ReadonlyArray<T>) => Array<K>;
    const lazy: <T>(fn: PredIndexedOptional<T, boolean>) => LazyEvaluator<T>;
    const lazyIndexed: (<T>(fn: PredIndexedOptional<T, boolean>) => LazyEvaluator<T>) & {
        readonly indexed: true;
    };
}
//# sourceMappingURL=reject.d.ts.map