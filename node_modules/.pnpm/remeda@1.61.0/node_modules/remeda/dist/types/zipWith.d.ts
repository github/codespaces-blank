type ZippingFunction<F = unknown, S = unknown, R = unknown> = (f: F, s: S) => R;
/**
 * Creates a new list from two supplied lists by calling the supplied function
 * with the same-positioned element from each list.
 *
 * @param first - The first input list.
 * @param second - The second input list.
 * @param fn - The function applied to each position of the list.
 * @signature
 *   R.zipWith(first, second, fn)
 * @example
 *   R.zipWith(['1', '2', '3'], ['a', 'b', 'c'], (a, b) => a + b) // => ['1a', '2b', '3c']
 * @dataFirst
 * @category Array
 */
export declare function zipWith<F, S, R>(first: ReadonlyArray<F>, second: ReadonlyArray<S>, fn: ZippingFunction<F, S, R>): Array<R>;
/**
 * Creates a new list from two supplied lists by calling the supplied function
 * with the same-positioned element from each list.
 *
 * @param fn - The function applied to each position of the list.
 * @signature
 *   R.zipWith(fn)(first, second)
 * @example
 *   R.zipWith((a, b) => a + b)(['1', '2', '3'], ['a', 'b', 'c']) // => ['1a', '2b', '3c']
 * @dataLast
 * @category Array
 */
export declare function zipWith<F, S, R>(fn: ZippingFunction<F, S, R>): (first: ReadonlyArray<F>, second: ReadonlyArray<S>) => Array<R>;
/**
 * Creates a new list from two supplied lists by calling the supplied function
 * with the same-positioned element from each list.
 *
 * @param fn - The function applied to each position of the list.
 * @param second - The second input list.
 * @signature
 *   R.zipWith(fn)(first, second)
 * @example
 *   R.zipWith((a, b) => a + b, ['a', 'b', 'c'])(['1', '2', '3']) // => ['1a', '2b', '3c']
 * @dataLast
 * @category Array
 */
export declare function zipWith<F, S, R>(fn: ZippingFunction<F, S, R>, second: ReadonlyArray<S>): (first: ReadonlyArray<F>) => Array<R>;
export {};
//# sourceMappingURL=zipWith.d.ts.map