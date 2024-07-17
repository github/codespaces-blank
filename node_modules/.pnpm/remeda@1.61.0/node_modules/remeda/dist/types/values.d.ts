type Values<T extends object> = T extends ReadonlyArray<unknown> | [] ? Array<T[number]> : Array<T[keyof T]>;
/**
 * Returns a new array containing the values of the array or object.
 *
 * @param data - Either an array or an object.
 * @signature
 *    R.values(source)
 * @example
 *    R.values(['x', 'y', 'z']) // => ['x', 'y', 'z']
 *    R.values({ a: 'x', b: 'y', c: 'z' }) // => ['x', 'y', 'z']
 *    R.pipe(['x', 'y', 'z'], R.values) // => ['x', 'y', 'z']
 *    R.pipe({ a: 'x', b: 'y', c: 'z' }, R.values) // => ['x', 'y', 'z']
 *    R.pipe(
 *      { a: 'x', b: 'y', c: 'z' },
 *      R.values,
 *      R.first,
 *    ) // => 'x'
 * @dataFirst
 * @pipeable
 * @category Object
 */
export declare function values<T extends object>(data: T): Values<T>;
export {};
//# sourceMappingURL=values.d.ts.map