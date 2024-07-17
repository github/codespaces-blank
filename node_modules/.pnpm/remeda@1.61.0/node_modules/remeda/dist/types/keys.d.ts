import type { IterableContainer } from "./_types";
/**
 * Returns a new array containing the keys of the array or object.
 *
 * @param source - Either an array or an object.
 * @signature
 *    R.keys(source)
 *    R.keys.strict(source)
 * @example
 *    R.keys(['x', 'y', 'z']) // => ['0', '1', '2']
 *    R.keys({ a: 'x', b: 'y', c: 'z' }) // => ['a', 'b', 'c']
 *    R.keys.strict({ a: 'x', b: 'y', 5: 'z' } as const ) // => ['a', 'b', '5'], typed Array<'a' | 'b' | '5'>
 *    R.pipe(['x', 'y', 'z'], R.keys) // => ['0', '1', '2']
 *    R.pipe({ a: 'x', b: 'y', c: 'z' }, R.keys) // => ['a', 'b', 'c']
 *    R.pipe(
 *      { a: 'x', b: 'y', c: 'z' },
 *      R.keys,
 *      R.first(),
 *    ) // => 'a'
 *    R.pipe({ a: 'x', b: 'y', 5: 'z' } as const, R.keys.strict) // => ['a', 'b', '5'], typed Array<'a' | 'b' | '5'>
 * @dataFirst
 * @pipeable
 * @strict
 * @category Object
 */
export declare function keys(source: ArrayLike<unknown> | Readonly<Record<PropertyKey, unknown>>): Array<string>;
type Strict = <T extends object>(data: T) => Keys<T>;
type Keys<T> = T extends IterableContainer ? ArrayKeys<T> : ObjectKeys<T>;
type ArrayKeys<T extends IterableContainer> = {
    -readonly [Index in keyof T]: Index extends number | string ? `${IsIndexAfterSpread<T, Index> extends true ? number : Index}` : never;
};
type IsIndexAfterSpread<T extends IterableContainer, Index extends number | string> = IndicesAfterSpread<T> extends never ? false : Index extends `${IndicesAfterSpread<T>}` ? true : false;
type IndicesAfterSpread<T extends ReadonlyArray<unknown> | [], Iterations extends ReadonlyArray<unknown> = []> = T[number] extends never ? never : T extends readonly [unknown, ...infer Tail] ? IndicesAfterSpread<Tail, [unknown, ...Iterations]> : T extends readonly [...infer Head, unknown] ? IndicesAfterSpread<Head, [unknown, ...Iterations]> | Iterations["length"] : Iterations["length"];
type ObjectKeys<T> = T extends Record<PropertyKey, never> ? [] : Array<`${Exclude<keyof T, symbol>}`>;
export declare namespace keys {
    const strict: Strict;
}
export {};
//# sourceMappingURL=keys.d.ts.map