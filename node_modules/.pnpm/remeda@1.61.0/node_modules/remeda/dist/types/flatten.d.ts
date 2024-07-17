import type { LazyEvaluator } from "./pipe";
type Flatten<T> = T extends ReadonlyArray<infer K> ? K : T;
/**
 * Flattens `array` a single level deep.
 *
 * ! **DEPRECATED** Use `R.flat(data)`. Will be removed in V2!
 *
 * @param items - The target array.
 * @signature
 *   R.flatten(array)
 * @example
 *    R.flatten([[1, 2], [3], [4, 5]]) // => [1, 2, 3, 4, 5]
 * @dataFirst
 * @pipeable
 * @category Deprecated
 * @deprecated Use `R.flat(data)`. Will be removed in V2!
 */
export declare function flatten<T>(items: ReadonlyArray<T>): Array<Flatten<T>>;
/**
 * Flattens `array` a single level deep.
 *
 * ! **DEPRECATED** Use `R.flat(data)`. Will be removed in V2!
 *
 * @signature
 *   R.flatten()(array)
 * @example
 *    R.pipe(
 *      [[1, 2], [3], [4, 5]],
 *      R.flatten(),
 *    ); // => [1, 2, 3, 4, 5]
 * @dataLast
 * @pipeable
 * @category Deprecated
 * @deprecated Use `R.flat()`. Will be removed in V2!
 */
export declare function flatten<T>(): (items: ReadonlyArray<T>) => Array<Flatten<T>>;
export declare namespace flatten {
    const lazy: <T>() => LazyEvaluator<T, Flatten<T>>;
}
export {};
//# sourceMappingURL=flatten.d.ts.map