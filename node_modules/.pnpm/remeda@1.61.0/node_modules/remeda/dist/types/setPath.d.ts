import type { Narrow } from "./_narrow";
import type { Path, SupportsValueAtPath, ValueAtPath } from "./_paths";
/**
 * Sets the value at `path` of `object`.
 *
 * @param object - The target method.
 * @param path - The array of properties.
 * @param value - The value to set.
 * @signature
 *    R.setPath(obj, path, value)
 * @example
 *    R.setPath({ a: { b: 1 } }, ['a', 'b'], 2) // => { a: { b: 2 } }
 * @dataFirst
 * @category Object
 */
export declare function setPath<T, TPath extends Array<PropertyKey> & Path<T>>(object: T, path: Narrow<TPath>, value: ValueAtPath<T, TPath>): T;
/**
 * Sets the value at `path` of `object`.
 *
 * @param path - The array of properties.
 * @param value - The value to set.
 * @signature
 *    R.setPath(path, value)(obj)
 * @example
 *    R.pipe({ a: { b: 1 } }, R.setPath(['a', 'b'], 2)) // { a: { b: 2 } }
 * @dataLast
 * @category Object
 */
export declare function setPath<TPath extends Array<PropertyKey>, Value>(path: Narrow<TPath>, value: Value): <Obj>(object: SupportsValueAtPath<Obj, TPath, Value>) => Obj;
export declare function _setPath(data: unknown, path: ReadonlyArray<PropertyKey>, value: unknown): unknown;
//# sourceMappingURL=setPath.d.ts.map