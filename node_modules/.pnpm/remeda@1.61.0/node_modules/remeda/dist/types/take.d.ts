import type { LazyEvaluator } from "./pipe";
/**
 * Returns the first `n` elements of `array`.
 *
 * @param array - The array.
 * @param n - The number of elements to take.
 * @signature
 *    R.take(array, n)
 * @example
 *    R.take([1, 2, 3, 4, 3, 2, 1], 3) // => [1, 2, 3]
 * @dataFirst
 * @pipeable
 * @category Array
 */
export declare function take<T>(array: ReadonlyArray<T>, n: number): Array<T>;
/**
 * Returns the first `n` elements of `array`.
 *
 * @param n - The number of elements to take.
 * @signature
 *    R.take(n)(array)
 * @example
 *    R.pipe([1, 2, 3, 4, 3, 2, 1], R.take(n)) // => [1, 2, 3]
 * @dataLast
 * @pipeable
 * @category Array
 */
export declare function take<T>(n: number): (array: ReadonlyArray<T>) => Array<T>;
export declare namespace take {
    function lazy<T>(n: number): LazyEvaluator<T>;
}
//# sourceMappingURL=take.d.ts.map