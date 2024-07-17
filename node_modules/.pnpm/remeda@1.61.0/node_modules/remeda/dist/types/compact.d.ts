/**
 * Filter out all falsy values. The values `false`, `null`, `0`, `""`,
 * `undefined`, and `NaN` are falsy.
 *
 * ! **DEPRECATED**: Use `R.filter(items, R.isTruthy)`. Will be removed in V2!
 *
 * @param items - The array to compact.
 * @signature
 *    R.compact(array)
 * @example
 *    R.compact([0, 1, false, 2, '', 3]) // => [1, 2, 3]
 * @category Deprecated
 * @deprecated Use `R.filter(items, R.isTruthy)`. Will be removed in V2!
 */
export declare function compact<T>(items: ReadonlyArray<T | "" | 0 | false | null | undefined>): Array<T>;
//# sourceMappingURL=compact.d.ts.map