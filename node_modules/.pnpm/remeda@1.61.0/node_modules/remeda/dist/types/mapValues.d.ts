import type { ObjectKeys } from "./_types";
/**
 * Maps values of `object` and keeps the same keys.
 *
 * @param data - The object to map.
 * @param fn - The mapping function.
 * @signature
 *    R.mapValues(object, fn)
 * @example
 *    R.mapValues({a: 1, b: 2}, (value, key) => value + key) // => {a: '1a', b: '2b'}
 * @dataFirst
 * @category Object
 */
export declare function mapValues<T extends Record<PropertyKey, unknown>, S>(data: T, fn: (value: T[ObjectKeys<T>], key: ObjectKeys<T>) => S): Record<ObjectKeys<T>, S>;
/**
 * Maps values of `object` and keeps the same keys.
 *
 * @param fn - The mapping function.
 * @signature
 *    R.mapValues(fn)(object)
 * @example
 *    R.pipe({a: 1, b: 2}, R.mapValues((value, key) => value + key)) // => {a: '1a', b: '2b'}
 * @dataLast
 * @category Object
 */
export declare function mapValues<T extends Record<PropertyKey, unknown>, S>(fn: (value: T[ObjectKeys<T>], key: ObjectKeys<T>) => S): (data: T) => Record<ObjectKeys<T>, S>;
//# sourceMappingURL=mapValues.d.ts.map