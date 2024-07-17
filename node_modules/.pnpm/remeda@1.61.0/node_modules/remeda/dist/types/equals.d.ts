/**
 * Returns true if its arguments are equivalent, false otherwise.
 * NOTE: Doesn't handle cyclical data structures.
 *
 * ! **DEPRECATED**: Use `R.isDeepEqual(a, b)`. Will be removed in V2.
 *
 * @param a - The first object to compare.
 * @param b - The second object to compare.
 * @signature
 *    R.equals(a, b)
 * @example
 *    R.equals(1, 1) //=> true
 *    R.equals(1, '1') //=> false
 *    R.equals([1, 2, 3], [1, 2, 3]) //=> true
 * @dataFirst
 * @category Deprecated
 * @deprecated Use `R.isDeepEqual(a, b)`. Will be removed in V2.
 */
export declare function equals(a: unknown, b: unknown): boolean;
/**
 * Returns true if its arguments are equivalent, false otherwise.
 * NOTE: Doesn't handle cyclical data structures.
 *
 * ! **DEPRECATED**: Use `R.isDeepEqual(b)`. Will be removed in V2.
 *
 * @param a - The first object to compare.
 * @param b - The second object to compare.
 * @signature
 *    R.equals(b)(a)
 * @example
 *    R.equals(1)(1) //=> true
 *    R.equals('1')(1) //=> false
 *    R.equals([1, 2, 3])([1, 2, 3]) //=> true
 * @dataLast
 * @category Deprecated
 * @deprecated Use `R.isDeepEqual(b)`. Will be removed in V2.
 */
export declare function equals(a: unknown): (b: unknown) => boolean;
//# sourceMappingURL=equals.d.ts.map