import type { IterableContainer } from "./_types";
type Entry<Key extends PropertyKey = PropertyKey, Value = unknown> = readonly [
    key: Key,
    value: Value
];
/**
 * Creates a new object from an array of tuples by pairing up first and second elements as {[key]: value}.
 * If a tuple is not supplied for any element in the array, the element will be ignored
 * If duplicate keys exist, the tuple with the greatest index in the input array will be preferred.
 *
 * The strict option supports more sophisticated use-cases like those that would
 * result when calling the strict `toPairs` function.
 *
 * There are several other functions that could be used to build an object from
 * an array:
 * * `fromKeys` - Builds an object from an array of *keys* and a mapper for values.
 * * `indexBy` - Builds an object from an array of *values* and a mapper for keys.
 * * `pullObject` - Builds an object from an array of items with mappers for *both* keys and values.
 * * `mapToObj` - Builds an object from an array of items and a single mapper for key-value pairs.
 * Refer to the docs for more details.
 *
 * ! **DEPRECATED**: Use `R.fromEntries(pairs)`, for dataLast invocations use the functional form `R.fromEntries()`. Will be removed in V2!
 *
 * @param pairs - The list of input tuples.
 * @signature
 *   R.fromPairs(tuples)
 *   R.fromPairs.strict(tuples)
 * @example
 *   R.fromPairs([['a', 'b'], ['c', 'd']]) // => {a: 'b', c: 'd'} (type: Record<string, string>)
 *   R.fromPairs.strict(['a', 1] as const) // => {a: 1} (type: {a: 1})
 *   R.pipe(
 *     [['a', 'b'], ['c', 'd']],
 *     R.fromPairs,
 *   ); // => {a: 'b', c: 'd'} (type: Record<string, string>)
 *   R.pipe(
 *     ['a', 1] as const,
 *     R.fromPairs.strict,
 *   ); // => {a: 1} (type: {a: 1})
 * @dataFirst
 * @strict
 * @category Deprecated
 * @deprecated Use `R.fromEntries(pairs)`, for dataLast invocations use the functional form `R.fromEntries()`. Will be removed in V2!
 */
export declare function fromPairs<V>(pairs: ReadonlyArray<Entry<number, V>>): Record<number, V>;
export declare function fromPairs<V>(pairs: ReadonlyArray<Entry<string, V>>): Record<string, V>;
type Strict = <Entries extends IterableContainer<Entry>>(entries: Entries) => StrictOut<Entries>;
type StrictOut<Entries> = Entries extends readonly [infer First, ...infer Tail] ? FromPairsTuple<First, Tail> : Entries extends readonly [...infer Head, infer Last] ? FromPairsTuple<Last, Head> : Entries extends IterableContainer<Entry> ? FromPairsArray<Entries> : "ERROR: Entries array-like could not be infered";
type FromPairsTuple<E, Rest> = E extends Entry ? Record<E[0], E[1]> & StrictOut<Rest> : "ERROR: Array-like contains a non-entry element";
type FromPairsArray<Entries extends IterableContainer<Entry>> = string extends AllKeys<Entries> ? Record<string, Entries[number][1]> : number extends AllKeys<Entries> ? Record<number, Entries[number][1]> : symbol extends AllKeys<Entries> ? Record<symbol, Entries[number][1]> : FromPairsArrayWithLiteralKeys<Entries>;
type FromPairsArrayWithLiteralKeys<Entries extends IterableContainer<Entry>> = {
    [K in AllKeys<Entries>]?: ValueForKey<Entries, K>;
};
type AllKeys<Entries extends IterableContainer<Entry>> = Extract<Entries[number], Entry>[0];
type ValueForKey<Entries extends IterableContainer<Entry>, K extends PropertyKey> = (Extract<Entries[number], Entry<K>> extends never ? Entries[number] : Extract<Entries[number], Entry<K>>)[1];
export declare namespace fromPairs {
    /**
     * @deprecated Use `R.fromEntries.strict(pairs)`, for dataLast invocations use the functional form `R.fromEntries.strict()`. Will be removed in V2!
     */
    const strict: Strict;
}
export {};
//# sourceMappingURL=fromPairs.d.ts.map