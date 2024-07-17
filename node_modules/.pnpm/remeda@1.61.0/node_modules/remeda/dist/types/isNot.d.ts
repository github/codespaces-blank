/**
 * A function that takes a guard function as predicate and returns a guard that negates it.
 *
 * @param predicate - The guard function to negate.
 * @returns Function A guard function.
 * @signature
 *    R.isNot(R.isTruthy)(data)
 * @example
 *    R.isNot(R.isTruthy)(false) //=> true
 *    R.isNot(R.isTruthy)(true) //=> false
 * @dataLast
 * @category Guard
 */
export declare function isNot<T, S extends T>(predicate: (data: T) => data is S): (data: T) => data is Exclude<T, S>;
export declare function isNot<T>(predicate: (data: T) => boolean): (data: T) => boolean;
//# sourceMappingURL=isNot.d.ts.map