import type { IterableContainer } from "./_types";
import type { IsNumericLiteral } from "./type-fest/is-literal";
type ArraySetRequired<T extends IterableContainer, Min extends number, Iteration extends ReadonlyArray<unknown> = []> = number extends Min ? never : Iteration["length"] extends Min ? T : T extends readonly [] ? never : T extends [infer Head, ...infer Rest] ? [
    Head,
    ...ArraySetRequired<Rest, Min, [unknown, ...Iteration]>
] : T extends readonly [infer Head, ...infer Rest] ? readonly [
    Head,
    ...ArraySetRequired<Rest, Min, [unknown, ...Iteration]>
] : T extends Array<infer Item> ? [
    Item,
    ...ArraySetRequired<T, Min, [unknown, ...Iteration]>
] : T extends ReadonlyArray<infer Item> ? readonly [
    Item,
    ...ArraySetRequired<T, Min, [unknown, ...Iteration]>
] : never;
/**
 * Checks if the given array has at least the defined number of elements. When
 * the minimum used is a literal (e.g. `3`) the output is refined accordingly so
 * that those indices are defined when accessing the array even when using
 * typescript's 'noUncheckedIndexAccess'.
 *
 * @param data - The input array.
 * @param minimum - The minimum number of elements the array must have.
 * @returns True if the array's length is *at least* `minimum`. When `minimum`
 * is a literal value, the output is narrowed to ensure the first items are
 * guaranteed.
 * @signature
 *   R.hasAtLeast(data, minimum)
 * @example
 *   R.hasAtLeast([], 4); // => false
 *
 *   const data: number[] = [1,2,3,4];
 *   R.hasAtLeast(data, 1); // => true
 *   data[0]; // 1, with type `number`
 * @dataFirst
 * @category Array
 */
export declare function hasAtLeast<T extends IterableContainer, N extends number>(data: IterableContainer | T, minimum: IsNumericLiteral<N> extends true ? N : never): data is ArraySetRequired<T, N>;
export declare function hasAtLeast(data: IterableContainer, minimum: number): boolean;
/**
 * Checks if the given array has at least the defined number of elements. When
 * the minimum used is a literal (e.g. `3`) the output is refined accordingly so
 * that those indices are defined when accessing the array even when using
 * typescript's 'noUncheckedIndexAccess'.
 *
 * @param minimum - The minimum number of elements the array must have.
 * @returns True if the array's length is *at least* `minimum`. When `minimum`
 * is a literal value, the output is narrowed to ensure the first items are
 * guaranteed.
 * @signature
 *   R.hasAtLeast(minimum)(data)
 * @example
 *   R.pipe([], R.hasAtLeast(4)); // => false
 *
 *   const data = [[1,2], [3], [4,5]];
 *   R.pipe(
 *     data,
 *     R.filter(R.hasAtLeast(2)),
 *     R.map(([, second]) => second),
 *   ); // => [2,5], with type `number[]`
 * @dataLast
 * @category Array
 */
export declare function hasAtLeast<N extends number>(minimum: IsNumericLiteral<N> extends true ? N : never): <T extends IterableContainer>(data: IterableContainer | T) => data is ArraySetRequired<T, N>;
export declare function hasAtLeast(minimum: number): (data: IterableContainer) => boolean;
export {};
//# sourceMappingURL=hasAtLeast.d.ts.map