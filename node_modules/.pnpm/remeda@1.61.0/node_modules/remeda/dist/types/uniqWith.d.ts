import type { LazyEvaluator } from "./pipe";
type IsEquals<T> = (a: T, b: T) => boolean;
/**
 * Returns a new array containing only one copy of each element in the original list.
 * Elements are compared by custom comparator isEquals.
 *
 * ! **DEPRECATED**: Use `R.uniqueWith(array, isEquals)`. Will be removed in V2!
 *
 * @param array - The array to filter.
 * @param isEquals - The comparator.
 * @signature
 *    R.uniqWith(array, isEquals)
 * @example
 *    R.uniqWith(
 *      [{a: 1}, {a: 2}, {a: 2}, {a: 5}, {a: 1}, {a: 6}, {a: 7}],
 *      R.equals,
 *    ) // => [{a: 1}, {a: 2}, {a: 5}, {a: 6}, {a: 7}]
 * @dataFirst
 * @category Deprecated
 * @deprecated Use `R.uniqueWith(array, isEquals)`. Will be removed in V2!
 */
export declare function uniqWith<T>(array: ReadonlyArray<T>, isEquals: IsEquals<T>): Array<T>;
/**
 * Returns a new array containing only one copy of each element in the original list.
 * Elements are compared by custom comparator isEquals.
 *
 * ! **DEPRECATED**: Use `R.uniqueWith(isEquals)`. Will be removed in V2!
 *
 * @param isEquals - The comparator.
 * @signature R.uniqWith(isEquals)(array)
 * @example
 *    R.uniqWith(R.equals)(
 *      [{a: 1}, {a: 2}, {a: 2}, {a: 5}, {a: 1}, {a: 6}, {a: 7}],
 *    ) // => [{a: 1}, {a: 2}, {a: 5}, {a: 6}, {a: 7}]
 *    R.pipe(
 *      [{a: 1}, {a: 2}, {a: 2}, {a: 5}, {a: 1}, {a: 6}, {a: 7}], // only 4 iterations
 *      R.uniqWith(R.equals),
 *      R.take(3)
 *    ) // => [{a: 1}, {a: 2}, {a: 5}]
 * @dataLast
 * @category Deprecated
 * @deprecated Use `R.uniqueWith(isEquals)`. Will be removed in V2!
 */
export declare function uniqWith<T>(isEquals: IsEquals<T>): (array: ReadonlyArray<T>) => Array<T>;
export declare namespace uniqWith {
    const lazy: (<T>(isEquals: IsEquals<T>) => LazyEvaluator<T>) & {
        readonly indexed: true;
    };
}
export {};
//# sourceMappingURL=uniqWith.d.ts.map