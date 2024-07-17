import type { Pred, PredIndexed, PredIndexedOptional } from "./_types";
import type { LazyEvaluator } from "./pipe";
/**
 * Iterate an array using a defined callback function. The original array is returned instead of `void`.
 *
 * @param array - The array.
 * @param fn - The callback function.
 * @returns The original array.
 * @signature
 *    R.forEach(array, fn)
 *    R.forEach.indexed(array, fn)
 * @example
 *    R.forEach([1, 2, 3], x => {
 *      console.log(x)
 *    }) // => [1, 2, 3]
 *    R.forEach.indexed([1, 2, 3], (x, i) => {
 *      console.log(x, i)
 *    }) // => [1, 2, 3]
 * @dataFirst
 * @indexed
 * @pipeable
 * @category Array
 */
export declare function forEach<T>(array: ReadonlyArray<T>, fn: Pred<T, void>): Array<T>;
/**
 * Iterate an array using a defined callback function. The original array is returned instead of `void`.
 *
 * @param fn - The function mapper.
 * @signature
 *    R.forEach(fn)(array)
 *    R.forEach.indexed(fn)(array)
 * @example
 *    R.pipe(
 *      [1, 2, 3],
 *      R.forEach(x => {
 *        console.log(x)
 *      })
 *    ) // => [1, 2, 3]
 *    R.pipe(
 *      [1, 2, 3],
 *      R.forEach.indexed((x, i) => {
 *        console.log(x, i)
 *      })
 *    ) // => [1, 2, 3]
 * @dataLast
 * @indexed
 * @pipeable
 * @category Array
 */
export declare function forEach<T>(fn: Pred<T, void>): (array: ReadonlyArray<T>) => Array<T>;
export declare namespace forEach {
    function indexed<T>(array: ReadonlyArray<T>, fn: PredIndexed<T, void>): Array<T>;
    function indexed<T>(fn: PredIndexed<T, void>): (array: ReadonlyArray<T>) => Array<T>;
    const lazy: <T>(fn: PredIndexedOptional<T, void>) => LazyEvaluator<T>;
    const lazyIndexed: (<T>(fn: PredIndexedOptional<T, void>) => LazyEvaluator<T>) & {
        readonly indexed: true;
    };
}
//# sourceMappingURL=forEach.d.ts.map