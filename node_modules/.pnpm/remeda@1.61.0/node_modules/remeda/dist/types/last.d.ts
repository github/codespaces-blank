import type { IterableContainer } from "./_types";
import type { LastArrayElement } from "./type-fest/last-array-element";
/**
 * Gets the last element of `array`.
 *
 * @param data - The array.
 * @signature
 *    R.last(array)
 * @example
 *    R.last([1, 2, 3]) // => 3
 *    R.last([]) // => undefined
 * @dataFirst
 * @pipeable
 * @category Array
 */
export declare function last<T extends IterableContainer>(data: T): LastArrayElement<T>;
/**
 * Gets the last element of `array`.
 *
 * @signature
 *    R.last()(array)
 * @example
 *    R.pipe(
 *      [1, 2, 4, 8, 16],
 *      R.filter(x => x > 3),
 *      R.last(),
 *      x => x + 1
 *    ); // => 17
 * @dataLast
 * @pipeable
 * @category Array
 */
export declare function last<T extends IterableContainer>(): (data: T) => LastArrayElement<T>;
//# sourceMappingURL=last.d.ts.map