import type { LazyEvaluator } from "./pipe";
/**
 * Removes first `n` elements from the `array`.
 *
 * @param array - The target array.
 * @param n - The number of elements to skip.
 * @signature
 *    R.drop(array, n)
 * @example
 *    R.drop([1, 2, 3, 4, 5], 2) // => [3, 4, 5]
 * @dataFirst
 * @pipeable
 * @category Array
 */
export declare function drop<T>(array: ReadonlyArray<T>, n: number): Array<T>;
/**
 * Removes first `n` elements from the `array`.
 *
 * @param n - The number of elements to skip.
 * @signature
 *    R.drop(n)(array)
 * @example
 *    R.drop(2)([1, 2, 3, 4, 5]) // => [3, 4, 5]
 * @dataLast
 * @pipeable
 * @category Array
 */
export declare function drop<T>(n: number): (array: ReadonlyArray<T>) => Array<T>;
export declare namespace drop {
    function lazy<T>(n: number): LazyEvaluator<T>;
}
//# sourceMappingURL=drop.d.ts.map