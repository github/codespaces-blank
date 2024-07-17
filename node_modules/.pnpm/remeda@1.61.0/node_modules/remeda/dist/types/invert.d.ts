type Inverted<T extends object> = T[keyof T] extends PropertyKey ? Record<T[keyof T], keyof T> : never;
/**
 * Returns an object whose keys and values are swapped. If the object contains duplicate values,
 * subsequent values will overwrite previous values.
 *
 * @param object - The object.
 * @signature
 *    R.invert(object)
 * @example
 *    R.invert({ a: "d", b: "e", c: "f" }) // => { d: "a", e: "b", f: "c" }
 * @dataFirst
 * @pipeable
 * @category Object
 */
export declare function invert<T extends object>(object: T): Inverted<T>;
/**
 * Returns an object whose keys and values are swapped. If the object contains duplicate values,
 * subsequent values will overwrite previous values.
 *
 * @signature
 *    R.invert()(object)
 * @example
 *    R.pipe({ a: "d", b: "e", c: "f" }, R.invert()); // => { d: "a", e: "b", f: "c" }
 * @dataLast
 * @pipeable
 * @category Object
 */
export declare function invert<T extends object>(): (object: T) => Inverted<T>;
export {};
//# sourceMappingURL=invert.d.ts.map