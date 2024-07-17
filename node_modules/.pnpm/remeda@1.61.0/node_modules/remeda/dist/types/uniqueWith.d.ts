import type { LazyEvaluator } from "./pipe";
type IsEquals<T> = (a: T, b: T) => boolean;
/**
 * Returns a new array containing only one copy of each element in the original
 * list. Elements are compared by custom comparator isEquals.
 *
 * @param array - The array to filter.
 * @param isEquals - The comparator.
 * @signature
 *    R.uniqueWith(array, isEquals)
 * @example
 *    R.uniqueWith(
 *      [{a: 1}, {a: 2}, {a: 2}, {a: 5}, {a: 1}, {a: 6}, {a: 7}],
 *      R.equals,
 *    ) // => [{a: 1}, {a: 2}, {a: 5}, {a: 6}, {a: 7}]
 * @dataFirst
 * @category Array
 */
export declare function uniqueWith<T>(array: ReadonlyArray<T>, isEquals: IsEquals<T>): Array<T>;
/**
 * Returns a new array containing only one copy of each element in the original
 * list. Elements are compared by custom comparator isEquals.
 *
 * @param isEquals - The comparator.
 * @signature R.uniqueWith(isEquals)(array)
 * @example
 *    R.uniqueWith(R.equals)(
 *      [{a: 1}, {a: 2}, {a: 2}, {a: 5}, {a: 1}, {a: 6}, {a: 7}],
 *    ) // => [{a: 1}, {a: 2}, {a: 5}, {a: 6}, {a: 7}]
 *    R.pipe(
 *      [{a: 1}, {a: 2}, {a: 2}, {a: 5}, {a: 1}, {a: 6}, {a: 7}], // only 4 iterations
 *      R.uniqueWith(R.equals),
 *      R.take(3)
 *    ) // => [{a: 1}, {a: 2}, {a: 5}]
 * @dataLast
 * @category Object
 */
export declare function uniqueWith<T>(isEquals: IsEquals<T>): (array: ReadonlyArray<T>) => Array<T>;
export declare namespace uniqueWith {
    const lazy: (<T>(isEquals: IsEquals<T>) => LazyEvaluator<T>) & {
        readonly indexed: true;
    };
}
export {};
//# sourceMappingURL=uniqueWith.d.ts.map