/**
 * Creates an object composed of the picked `object` properties.
 *
 * @param names - The properties names.
 * @signature R.pick([prop1, prop2])(object)
 * @example
 *    R.pipe({ a: 1, b: 2, c: 3, d: 4 }, R.pick(['a', 'd'])) // => { a: 1, d: 4 }
 * @dataLast
 * @category Object
 */
export declare function pick<T extends object, K extends keyof T>(names: ReadonlyArray<K>): (object: T) => Pick<T, K>;
/**
 * Creates an object composed of the picked `object` properties.
 *
 * @param object - The target object.
 * @param names - The properties names.
 * @signature R.pick(object, [prop1, prop2])
 * @example
 *    R.pick({ a: 1, b: 2, c: 3, d: 4 }, ['a', 'd']) // => { a: 1, d: 4 }
 * @dataFirst
 * @category Object
 */
export declare function pick<T extends object, K extends keyof T>(object: T, names: ReadonlyArray<K>): Pick<T, K>;
//# sourceMappingURL=pick.d.ts.map