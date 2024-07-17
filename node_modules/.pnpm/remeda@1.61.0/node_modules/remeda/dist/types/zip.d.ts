import type { IterableContainer } from "./_types";
/**
 * Creates a new list from two supplied lists by pairing up equally-positioned items.
 * The length of the returned list will match the shortest of the two inputs.
 *
 * If the input array are tuples, you can use the strict option
 * to get another tuple instead of a generic array type.
 *
 * @param first - The first input list.
 * @param second - The second input list.
 * @signature
 *   R.zip(first, second)
 * @example
 *   R.zip([1, 2], ['a', 'b']) // => [[1, 'a'], [2, 'b']] (type: [number, string][])
 *   R.zip.strict([1, 2] as const, ['a', 'b'] as const) // => [[1, 'a'], [2, 'b']]  (type: [[1, 'a'], [2, 'b']])
 * @dataFirst
 * @strict
 * @category Array
 */
export declare function zip<F, S>(first: ReadonlyArray<F>, second: ReadonlyArray<S>): Array<[F, S]>;
/**
 * Creates a new list from two supplied lists by pairing up equally-positioned items.
 * The length of the returned list will match the shortest of the two inputs.
 *
 * If the input array are tuples, you can use the strict option
 * to get another tuple instead of a generic array type.
 *
 * @param second - The second input list.
 * @signature
 *   R.zip(second)(first)
 * @example
 *   R.zip(['a', 'b'])([1, 2]) // => [[1, 'a'], [2, 'b']] (type: [number, string][])
 *   R.zip.strict(['a', 'b'] as const)([1, 2] as const) // => [[1, 'a'], [2, 'b']]  (type: [[1, 'a'], [2, 'b']])
 * @dataLast
 * @strict
 * @category Array
 */
export declare function zip<S>(second: ReadonlyArray<S>): <F>(first: ReadonlyArray<F>) => Array<[F, S]>;
type Strict = {
    <F extends IterableContainer, S extends IterableContainer>(first: F, second: S): Zip<F, S>;
    <S extends IterableContainer>(second: S): <F extends IterableContainer>(first: F) => Zip<F, S>;
};
type Zip<Left extends IterableContainer, Right extends IterableContainer> = Left extends readonly [] ? [] : Right extends readonly [] ? [] : Left extends readonly [infer LeftHead, ...infer LeftRest] ? Right extends readonly [infer RightHead, ...infer RightRest] ? [
    [LeftHead, RightHead],
    ...Zip<LeftRest, RightRest>
] : [
    [LeftHead, Right[number]],
    ...Zip<LeftRest, Right>
] : Right extends readonly [infer RightHead, ...infer RightRest] ? [[Left[number], RightHead], ...Zip<Left, RightRest>] : Array<[Left[number], Right[number]]>;
export declare namespace zip {
    const strict: Strict;
}
export {};
//# sourceMappingURL=zip.d.ts.map