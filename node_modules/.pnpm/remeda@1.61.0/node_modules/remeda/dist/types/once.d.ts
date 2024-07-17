/**
 * Creates a function that is restricted to invoking `func` once. Repeat calls to the function return the value of the first invocation.
 *
 * @param fn - The function to wrap.
 * @signature R.once(fn)
 * @example
 * const initialize = R.once(createApplication);
 * initialize();
 * initialize();
 * // => `createApplication` is invoked once
 * @category Function
 */
export declare function once<T>(fn: () => T): () => T;
//# sourceMappingURL=once.d.ts.map