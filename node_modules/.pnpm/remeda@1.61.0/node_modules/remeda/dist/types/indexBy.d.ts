import type { PredIndexed } from "./_types";
/**
 * Converts a list of objects into an object indexing the objects by the given key (casted to a string).
 * Use the strict version to maintain the given key's type, so long as it is a valid `PropertyKey`.
 *
 * There are several other functions that could be used to build an object from
 * an array:
 * * `fromKeys` - Builds an object from an array of *keys* and a mapper for values.
 * * `pullObject` - Builds an object from an array of items with mappers for *both* keys and values.
 * * `fromEntries` - Builds an object from an array of key-value pairs.
 * * `mapToObj` - Builds an object from an array of items and a single mapper for key-value pairs.
 * Refer to the docs for more details.
 *
 * @param array - The array.
 * @param fn - The indexing function.
 * @signature
 *    R.indexBy(array, fn)
 *    R.indexBy.strict(array, fn)
 * @example
 *    R.indexBy(['one', 'two', 'three'], x => x.length) // => {"3": 'two', "5": 'three'}
 *    R.indexBy.strict(['one', 'two', 'three'], x => x.length) // => {3: 'two', 5: 'three'}
 * @dataFirst
 * @indexed
 * @strict
 * @category Array
 */
export declare function indexBy<T>(array: ReadonlyArray<T>, fn: (item: T) => unknown): Record<string, T>;
/**
 * Converts a list of objects into an object indexing the objects by the given key.
 * (casted to a string). Use the strict version to maintain the given key's type, so
 * long as it is a valid `PropertyKey`.
 *
 * There are several other functions that could be used to build an object from
 * an array:
 * * `fromKeys` - Builds an object from an array of *keys* and a mapper for values.
 * * `pullObject` - Builds an object from an array of items with mappers for *both* keys and values.
 * * `fromEntries` - Builds an object from an array of key-value pairs.
 * * `mapToObj` - Builds an object from an array of items and a single mapper for key-value pairs.
 * Refer to the docs for more details.
 *
 * @param fn - The indexing function.
 * @signature
 *    R.indexBy(fn)(array)
 *    R.indexBy.strict(fn)(array)
 * @example
 *    R.pipe(
 *      ['one', 'two', 'three'],
 *      R.indexBy(x => x.length)
 *    ) // => {"3": 'two', "5": 'three'}
 *    R.pipe(
 *      ['one', 'two', 'three'],
 *      R.indexBy.strict(x => x.length)
 *    ) // => {3: 'two', 5: 'three'}
 * @dataLast
 * @indexed
 * @strict
 * @category Array
 */
export declare function indexBy<T>(fn: (item: T) => unknown): (array: ReadonlyArray<T>) => Record<string, T>;
declare function indexByStrict<K extends PropertyKey, T>(array: ReadonlyArray<T>, fn: (item: T) => K): Partial<Record<K, T>>;
declare function indexByStrict<K extends PropertyKey, T>(fn: (item: T) => K): (array: ReadonlyArray<T>) => Partial<Record<K, T>>;
export declare namespace indexBy {
    function indexed<T>(array: ReadonlyArray<T>, fn: PredIndexed<T, unknown>): Record<string, T>;
    function indexed<T>(fn: PredIndexed<T, unknown>): (array: ReadonlyArray<T>) => Record<string, T>;
    const strict: typeof indexByStrict;
}
export {};
//# sourceMappingURL=indexBy.d.ts.map