/**
 * Performs a deep *semantic* comparison between two values to determine if they
 * are equivalent. For primitive values this is equivalent to `===`, for arrays
 * the check would be performed on every item recursively, in order, and for
 * objects all props will be compared recursively. The built-in Date and RegExp
 * are special-cased and will be compared by their values.
 *
 * !IMPORTANT: TypedArrays and symbol properties of objects are
 * not supported right now and might result in unexpected behavior. Please open
 * an issue in the Remeda github project if you need support for these types.
 *
 * The result would be narrowed to the second value so that the function can be
 * used as a type guard.
 *
 * @param data - The first value to compare.
 * @param other - The second value to compare.
 * @signature
 *    R.isDeepEqual(data, other)
 * @example
 *    R.isDeepEqual(1, 1) //=> true
 *    R.isDeepEqual(1, '1') //=> false
 *    R.isDeepEqual([1, 2, 3], [1, 2, 3]) //=> true
 * @dataFirst
 * @category Guard
 */
export declare function isDeepEqual<T, S extends T>(data: T, other: T extends Exclude<T, S> ? S : never): data is S;
export declare function isDeepEqual<T, S extends T = T>(data: T, other: S): boolean;
/**
 * Performs a deep *semantic* comparison between two values to determine if they
 * are equivalent. For primitive values this is equivalent to `===`, for arrays
 * the check would be performed on every item recursively, in order, and for
 * objects all props will be compared recursively. The built-in Date and RegExp
 * are special-cased and will be compared by their values.
 *
 * !IMPORTANT: Sets, TypedArrays, and symbol properties of objects are not
 * supported right now and might result in unexpected behavior. Please open an
 * issue in the Remeda github project if you need support for these types.
 *
 * The result would be narrowed to the second value so that the function can be
 * used as a type guard.
 *
 * @param other - The second value to compare.
 * @signature
 *    R.isDeepEqual(other)(data)
 * @example
 *    R.pipe(1, R.isDeepEqual(1)); //=> true
 *    R.pipe(1, R.isDeepEqual('1')); //=> false
 *    R.pipe([1, 2, 3], R.isDeepEqual([1, 2, 3])); //=> true
 * @dataLast
 * @category Guard
 */
export declare function isDeepEqual<T, S extends T>(other: T extends Exclude<T, S> ? S : never): (data: T) => data is S;
export declare function isDeepEqual<S>(other: S): <T extends S = S>(data: T) => boolean;
//# sourceMappingURL=isDeepEqual.d.ts.map