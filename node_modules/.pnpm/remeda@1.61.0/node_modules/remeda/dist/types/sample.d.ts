import type { IterableContainer } from "./_types";
type Sampled<T extends IterableContainer, N extends number> = number extends N ? SampledGeneric<T> : undefined extends T[N] ? T : SampledLiteral<T, N>;
type SampledGeneric<T extends IterableContainer> = T[number] extends never ? T : T extends readonly [infer First, ...infer Rest] ? SampledGeneric<Rest> | [First, ...SampledGeneric<Rest>] : Array<T[number]>;
type SampledLiteral<T extends IterableContainer, N extends number, Iteration extends Array<unknown> = []> = Iteration["length"] extends N ? [] : T extends readonly [infer First, ...infer Tail] ? [
    First | Tail[number],
    ...SampledLiteral<Tail, N, [unknown, ...Iteration]>
] : T extends readonly [...infer Head, infer Last] ? [...SampledLiteral<Head, N, [unknown, ...Iteration]>, Last] : SampledLiteral<T, N, [unknown, ...Iteration]> | [T[number], ...SampledLiteral<T, N, [unknown, ...Iteration]>];
/**
 * Returns a random subset of size `sampleSize` from `array`.
 *
 * Maintains and infers most of the typing information that could be passed
 * along to the output. This means that when using tuples, the output will be
 * a tuple too, and when using literals, those literals would be preserved.
 *
 * The items in the result are kept in the same order as they are in the input.
 * If you need to get a shuffled response you can pipe the shuffle function
 * after this one.
 *
 * @param data - The array.
 * @param sampleSize - The number of elements to take.
 * @signature
 *    R.sample(array, sampleSize)
 * @example
 *    R.sample(["hello", "world"], 1); // => ["hello"] // typed string[]
 *    R.sample(["hello", "world"] as const, 1); // => ["world"] // typed ["hello" | "world"]
 * @dataFirst
 * @pipeable
 * @category Array
 */
export declare function sample<T extends IterableContainer, N extends number = number>(data: T, sampleSize: N): Sampled<T, N>;
/**
 * Returns a random subset of size `sampleSize` from `array`.
 *
 * Maintains and infers most of the typing information that could be passed
 * along to the output. This means that when using tuples, the output will be
 * a tuple too, and when using literals, those literals would be preserved.
 *
 * The items in the result are kept in the same order as they are in the input.
 * If you need to get a shuffled response you can pipe the shuffle function
 * after this one.
 *
 * @param sampleSize - The number of elements to take.
 * @signature
 *    R.sample(sampleSize)(array)
 * @example
 *    R.sample(1)(["hello", "world"]); // => ["hello"] // typed string[]
 *    R.sample(1)(["hello", "world"] as const); // => ["world"] // typed ["hello" | "world"]
 * @dataLast
 * @pipeable
 * @category Array
 */
export declare function sample<T extends IterableContainer, N extends number = number>(sampleSize: N): (data: T) => Sampled<T, N>;
export {};
//# sourceMappingURL=sample.d.ts.map