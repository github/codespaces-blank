type IndexedIteratee<T extends Record<PropertyKey, unknown>, K extends keyof T> = (value: T[K], key: K, obj: T) => void;
type UnindexedIteratee<T extends Record<PropertyKey, unknown>> = (value: T[keyof T]) => void;
/**
 * Iterate an object using a defined callback function. The original object is returned.
 *
 * @param object - The object.
 * @param fn - The callback function.
 * @returns The original object.
 * @signature
 *    R.forEachObj(object, fn)
 * @example
 *    R.forEachObj({a: 1}, (val) => {
 *      console.log(`${val}`)
 *    }) // "1"
 *    R.forEachObj.indexed({a: 1}, (val, key, obj) => {
 *      console.log(`${key}: ${val}`)
 *    }) // "a: 1"
 * @dataFirst
 * @category Object
 */
export declare function forEachObj<T extends Record<PropertyKey, unknown>>(object: T, fn: UnindexedIteratee<T>): T;
/**
 * Iterate an object using a defined callback function. The original object is returned.
 *
 * @param fn - The callback function.
 * @signature
 *    R.forEachObj(fn)(object)
 * @example
 *  R.pipe(
 *      {a: 1},
 *      R.forEachObj((val) => console.log(`${val}`))
 *    ) // "1"
 *    R.pipe(
 *      {a: 1},
 *      R.forEachObj.indexed((val, key) => console.log(`${key}: ${val}`))
 *    ) // "a: 1"
 * @dataLast
 * @category Object
 */
export declare function forEachObj<T extends Record<PropertyKey, unknown>>(fn: UnindexedIteratee<T>): (object: T) => T;
export declare namespace forEachObj {
    function indexed<T extends Record<PropertyKey, unknown>>(object: T, fn: IndexedIteratee<T, keyof T>): T;
    function indexed<T extends Record<PropertyKey, unknown>>(fn: IndexedIteratee<T, keyof T>): (object: T) => T;
}
export {};
//# sourceMappingURL=forEachObj.d.ts.map