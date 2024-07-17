import type { IterableContainer, Mapped } from "./_types";
import type { LazyEvaluator } from "./pipe";
/**
 * Applies a function on each element of the array, using the result of the previous application, and returns an array of the successively computed values.
 *
 * @param array - The array to map over.
 * @param reducer - The callback function that receives the previous value, the current element, and optionally the index and the whole array.
 * @param initialValue - The initial value to start the computation with.
 * @returns An array of successively computed values from the left side of the array.
 * @signature
 *    R.mapWithFeedback(items, fn, initialValue)
 *    R.mapWithFeedback.indexed(items, fn, initialValue)
 * @example
 *    R.mapWithFeedback([1, 2, 3, 4, 5], (prev, x) => prev + x, 100) // => [101, 103, 106, 110, 115]
 *    R.mapWithFeedback.indexed([1, 2, 3, 4, 5], (prev, x, i, array) => prev + x, 100) // => [101, 103, 106, 110, 115]
 * @dataFirst
 * @indexed
 * @pipeable
 * @category Array
 */
export declare function mapWithFeedback<T extends IterableContainer, U>(array: T, reducer: (previousValue: U, currentValue: T[number]) => U, initialValue: U): Mapped<T, U>;
/**
 * Applies a function on each element of the array, using the result of the previous application, and returns an array of the successively computed values.
 *
 * @param reducer - The callback function that receives the previous value, the current element, and optionally the index and the whole array.
 * @param initialValue - The initial value to start the computation with.
 * @returns An array of successively computed values from the left side of the array.
 * @signature
 *    R.mapWithFeedback(fn, initialValue)(array)
 * @example
 *    R.pipe([1, 2, 3, 4, 5], R.mapWithFeedback((prev, x) => prev + x, 100)) // => [101, 103, 106, 110, 115]
 *    R.pipe([1, 2, 3, 4, 5], R.mapWithFeedback.indexed((prev, x, i, array) => prev + x, 100)) // => [101, 103, 106, 110, 115]
 * @dataLast
 * @indexed
 * @pipeable
 * @category Array
 */
export declare function mapWithFeedback<T extends IterableContainer, U>(reducer: (previousValue: U, currentValue: T[number]) => U, initialValue: U): (items: T) => Mapped<T, U>;
export declare namespace mapWithFeedback {
    function indexed<T extends IterableContainer, U>(items: T, reducer: (previousValue: U, currentValue: T[number], index: number, items: T) => U, initialValue: U): Mapped<T, U>;
    function indexed<T extends IterableContainer, U>(reducer: (previousValue: U, currentValue: T[number], index: number, items: T) => U, initialValue: U): (items: T) => Mapped<T, U>;
    const lazy: <T, U>(reducer: (previousValue: U, currentValue: T, index?: number | undefined, items?: readonly T[] | undefined) => U, initialValue: U) => LazyEvaluator<T, U>;
    const lazyIndexed: (<T, U>(reducer: (previousValue: U, currentValue: T, index?: number | undefined, items?: readonly T[] | undefined) => U, initialValue: U) => LazyEvaluator<T, U>) & {
        readonly indexed: true;
    };
}
//# sourceMappingURL=mapWithFeedback.d.ts.map