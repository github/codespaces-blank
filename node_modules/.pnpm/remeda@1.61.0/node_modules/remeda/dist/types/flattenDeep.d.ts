import type { LazyEvaluator } from "./pipe";
type FlattenDeep<T> = T extends ReadonlyArray<infer K> ? FlattenDeep2<K> : T;
type FlattenDeep2<T> = T extends ReadonlyArray<infer K> ? FlattenDeep3<K> : T;
type FlattenDeep3<T> = T extends ReadonlyArray<infer K> ? FlattenDeep4<K> : T;
type FlattenDeep4<T> = T extends ReadonlyArray<infer K> ? K : T;
/**
 * Recursively flattens `array`.
 *
 * ! **DEPRECATED** Use `R.flat(data, 4)`. The typing for `flattenDeep` was broken for arrays nested more than 4 levels deep; this might lead to typing issues when migrating to the new function. Will be removed in V2!
 *
 * @param items - The target array.
 * @signature
 *   R.flattenDeep(array)
 * @example
 *    R.flattenDeep([[1, 2], [[3], [4, 5]]]) // => [1, 2, 3, 4, 5]
 * @pipeable
 * @category Deprecated
 * @deprecated Use `R.flat(data, 4)`. The typing for `flattenDeep` was broken for arrays nested more than 4 levels deep; this might lead to typing issues when migrating to the new function. Will be removed in V2!
 */
export declare function flattenDeep<T>(items: ReadonlyArray<T>): Array<FlattenDeep<T>>;
/**
 * Recursively flattens `array`.
 *
 * ! **DEPRECATED** Use `R.flat(4)`. The typing for `flattenDeep` was broken for arrays nested more than 4 levels deep; this might lead to typing issues when migrating to the new function. Will be removed in V2!
 *
 * @signature
 *   R.flattenDeep()(array)
 * @example
 *    R.pipe(
 *      [[1, 2], [[3], [4, 5]]],
 *      R.flattenDeep(),
 *    ); // => [1, 2, 3, 4, 5]
 * @dataLast
 * @pipeable
 * @category Deprecated
 * @deprecated Use `R.flat(4)`. The typing for `flattenDeep` was broken for arrays nested more than 4 levels deep; this might lead to typing issues when migrating to the new function. Will be removed in V2!
 */
export declare function flattenDeep<T>(): (items: ReadonlyArray<T>) => Array<FlattenDeep<T>>;
export declare namespace flattenDeep {
    const lazy: <T>() => LazyEvaluator<T, any>;
}
export {};
//# sourceMappingURL=flattenDeep.d.ts.map