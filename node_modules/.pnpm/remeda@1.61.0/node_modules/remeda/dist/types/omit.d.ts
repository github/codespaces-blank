/**
 * Returns a partial copy of an object omitting the keys specified.
 *
 * @param propNames - The property names.
 * @signature
 *    R.omit(names)(obj);
 * @example
 *    R.pipe({ a: 1, b: 2, c: 3, d: 4 }, R.omit(['a', 'd'])) // => { b: 2, c: 3 }
 * @dataLast
 * @category Object
 */
export declare function omit<T extends object, K extends keyof T>(propNames: ReadonlyArray<K>): (data: T) => Omit<T, K>;
/**
 * Returns a partial copy of an object omitting the keys specified.
 *
 * @param data - The object.
 * @param propNames - The property names.
 * @signature
 *    R.omit(obj, names);
 * @example
 *    R.omit({ a: 1, b: 2, c: 3, d: 4 }, ['a', 'd']) // => { b: 2, c: 3 }
 * @dataFirst
 * @category Object
 */
export declare function omit<T extends object, K extends keyof T>(data: T, propNames: ReadonlyArray<K>): Omit<T, K>;
//# sourceMappingURL=omit.d.ts.map