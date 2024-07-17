/**
 * Returns a partial copy of an object omitting the keys matching predicate.
 *
 * @param object - The target object.
 * @param fn - The predicate.
 * @signature R.omitBy(object, fn)
 * @example
 *    R.omitBy({a: 1, b: 2, A: 3, B: 4}, (val, key) => key.toUpperCase() === key) // => {a: 1, b: 2}
 * @dataFirst
 * @category Object
 */
export declare function omitBy<T>(object: T, fn: <K extends keyof T>(value: T[K], key: K) => boolean): T extends Record<keyof T, T[keyof T]> ? T : Partial<T>;
/**
 * Returns a partial copy of an object omitting the keys matching predicate.
 *
 * @param fn - The predicate.
 * @signature R.omitBy(fn)(object)
 * @example
 *    R.omitBy((val, key) => key.toUpperCase() === key)({a: 1, b: 2, A: 3, B: 4}) // => {a: 1, b: 2}
 * @dataLast
 * @category Object
 */
export declare function omitBy<T>(fn: <K extends keyof T>(value: T[K], key: K) => boolean): (object: T) => T extends Record<keyof T, T[keyof T]> ? T : Partial<T>;
//# sourceMappingURL=omitBy.d.ts.map