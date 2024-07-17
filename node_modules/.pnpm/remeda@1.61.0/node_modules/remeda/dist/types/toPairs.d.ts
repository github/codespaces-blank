/**
 * Returns an array of key/values of the enumerable properties of an object.
 *
 * ! **DEPRECATED** Use `R.entries(object)`, for dataLast invocations use the functional form `R.entries()`. Will be removed in V2!
 *
 * @param object - Object to return keys and values of.
 * @signature
 *    R.toPairs(object)
 *    R.toPairs.strict(object)
 * @example
 *    R.toPairs({ a: 1, b: 2, c: 3 }) // => [['a', 1], ['b', 2], ['c', 3]]
 *    R.toPairs.strict({ a: 1 } as const) // => [['a', 1]] typed Array<['a', 1]>
 *    R.pipe(
 *      { a: 1, b: 2, c: 3 },
 *      toPairs,
 *    ); // => [['a', 1], ['b', 2], ['c', 3]]
 *    R.pipe(
 *      { a: 1 } as const,
 *      toPairs.strict,
 *    ); // => [['a', 1]] typed Array<['a', 1]>
 * @dataFirst
 * @strict
 * @category Deprecated
 * @deprecated Use `R.entries(object)`, for dataLast invocations use the functional form `R.entries()`. Will be removed in V2!
 */
export declare function toPairs<T>(object: Readonly<Record<string, T>>): Array<[string, T]>;
type Pairs<T> = Array<{
    [K in keyof T]-?: [key: K, value: Required<T>[K]];
}[keyof T]>;
type Strict = <T extends NonNullable<unknown>>(object: T) => Pairs<T>;
export declare namespace toPairs {
    /**
     * @deprecated Use `R.entries.strict(object)`, for dataLast invocations use the functional form `R.entries.strict(object)`. Will be removed in V2!
     */
    const strict: Strict;
}
export {};
//# sourceMappingURL=toPairs.d.ts.map