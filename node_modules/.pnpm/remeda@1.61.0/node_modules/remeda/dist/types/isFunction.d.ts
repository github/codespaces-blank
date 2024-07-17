type DefinitelyFunction<T> = Extract<T, Function> extends never ? Function : Extract<T, Function>;
/**
 * A function that checks if the passed parameter is a Function and narrows its type accordingly.
 *
 * @param data - The variable to check.
 * @returns True if the passed input is a Function, false otherwise.
 * @signature
 *    R.isFunction(data)
 * @example
 *    R.isFunction(() => {}) //=> true
 *    R.isFunction('somethingElse') //=> false
 * @category Guard
 */
export declare function isFunction<T>(data: Function | T): data is DefinitelyFunction<T>;
export {};
//# sourceMappingURL=isFunction.d.ts.map