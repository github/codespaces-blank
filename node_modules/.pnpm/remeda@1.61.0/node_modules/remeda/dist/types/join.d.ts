import type { IterableContainer } from "./_types";
type Joinable = bigint | boolean | number | string | null | undefined;
export type Joined<T extends IterableContainer, Glue extends string> = T[number] extends never ? "" : T extends readonly [Joinable?] ? `${NullishCoalesce<T[0], "">}` : T extends readonly [infer First, ...infer Tail] ? `${NullishCoalesce<First, "">}${Glue}${Joined<Tail, Glue>}` : T extends readonly [...infer Head, infer Last] ? `${Joined<Head, Glue>}${Glue}${NullishCoalesce<Last, "">}` : string;
type NullishCoalesce<T, Fallback> = T extends Joinable ? T extends null | undefined ? Fallback | NonNullable<T> : T : never;
/**
 * Joins the elements of the array by: casting them to a string and
 * concatenating them one to the other, with the provided glue string in between
 * every two elements.
 *
 * When called on a tuple and with stricter item types (union of literal values,
 * the result is strictly typed to the tuples shape and it's item types).
 *
 * @param data - The array to join.
 * @param glue - The string to put in between every two elements.
 * @signature
 *    R.join(data, glue)
 * @example
 *    R.join([1,2,3], ",") // => "1,2,3" (typed `string`)
 *    R.join(['a','b','c'], "") // => "abc" (typed `string`)
 *    R.join(['hello', 'world'] as const, " ") // => "hello world" (typed `hello world`)
 * @dataFirst
 * @category Array
 */
export declare function join<T extends ReadonlyArray<Joinable> | [], Glue extends string>(data: T, glue: Glue): Joined<T, Glue>;
/**
 * Joins the elements of the array by: casting them to a string and
 * concatenating them one to the other, with the provided glue string in between
 * every two elements.
 *
 * When called on a tuple and with stricter item types (union of literal values,
 * the result is strictly typed to the tuples shape and it's item types).
 *
 * @param glue - The string to put in between every two elements.
 * @signature
 *    R.join(glue)(data)
 * @example
 *    R.pipe([1,2,3], R.join(",")) // => "1,2,3" (typed `string`)
 *    R.pipe(['a','b','c'], R.join("")) // => "abc" (typed `string`)
 *    R.pipe(['hello', 'world'] as const, R.join(" ")) // => "hello world" (typed `hello world`)
 * @dataLast
 * @category Array
 */
export declare function join<T extends ReadonlyArray<Joinable> | [], Glue extends string>(glue: Glue): (data: T) => Joined<T, Glue>;
export {};
//# sourceMappingURL=join.d.ts.map