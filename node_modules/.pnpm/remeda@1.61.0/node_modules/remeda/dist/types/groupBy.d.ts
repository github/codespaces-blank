import type { NonEmptyArray, PredIndexed } from "./_types";
/**
 * Splits a collection into sets, grouped by the result of running each value through `fn`.
 *
 * @param items - The items to group.
 * @param fn - The grouping function. When `undefined` is returned the item would
 * be skipped and not grouped under any key.
 * @signature
 *    R.groupBy(array, fn)
 *    R.groupBy.strict(array, fn)
 * @example
 *    R.groupBy(['one', 'two', 'three'], x => x.length) // => {3: ['one', 'two'], 5: ['three']}
 *    R.groupBy.strict([{a: 'cat'}, {a: 'dog'}] as const, prop('a')) // => {cat: [{a: 'cat'}], dog: [{a: 'dog'}]} typed Partial<Record<'cat' | 'dog', NonEmptyArray<{a: 'cat' | 'dog'}>>>
 *    R.groupBy([0, 1], x => x % 2 === 0 ? 'even' : undefined) // => {even: [0]}
 * @dataFirst
 * @indexed
 * @strict
 * @category Array
 */
export declare function groupBy<T>(items: ReadonlyArray<T>, fn: (item: T) => PropertyKey | undefined): Record<PropertyKey, NonEmptyArray<T>>;
export declare function groupBy<T>(fn: (item: T) => PropertyKey | undefined): (array: ReadonlyArray<T>) => Record<PropertyKey, NonEmptyArray<T>>;
type Strict = {
    <Value, Key extends PropertyKey = PropertyKey>(items: ReadonlyArray<Value>, fn: (item: Value) => Key | undefined): StrictOut<Value, Key>;
    <Value, Key extends PropertyKey = PropertyKey>(fn: (item: Value) => Key | undefined): (items: ReadonlyArray<Value>) => StrictOut<Value, Key>;
    readonly indexed: {
        <Value, Key extends PropertyKey = PropertyKey>(items: ReadonlyArray<Value>, fn: PredIndexed<Value, Key | undefined>): StrictOut<Value, Key>;
        <Value, Key extends PropertyKey = PropertyKey>(fn: PredIndexed<Value, Key | undefined>): (items: ReadonlyArray<Value>) => StrictOut<Value, Key>;
    };
};
type StrictOut<Value, Key extends PropertyKey = PropertyKey> = string extends Key ? Record<Key, NonEmptyArray<Value>> : number extends Key ? Record<Key, NonEmptyArray<Value>> : symbol extends Key ? Record<Key, NonEmptyArray<Value>> : Partial<Record<Key, NonEmptyArray<Value>>>;
export declare namespace groupBy {
    function indexed<T>(array: ReadonlyArray<T>, fn: PredIndexed<T, PropertyKey | undefined>): Record<string, NonEmptyArray<T>>;
    function indexed<T>(fn: PredIndexed<T, PropertyKey | undefined>): (array: ReadonlyArray<T>) => Record<string, NonEmptyArray<T>>;
    const strict: Strict;
}
export {};
//# sourceMappingURL=groupBy.d.ts.map