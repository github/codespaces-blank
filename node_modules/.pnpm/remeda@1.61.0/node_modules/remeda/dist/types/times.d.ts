/**
 * Calls an input function `n` times, returning an array containing the results
 * of those function calls.
 *
 * `fn` is passed one argument: The current value of `n`, which begins at `0`
 * and is gradually incremented to `n - 1`.
 *
 * @param count - A value between `0` and `n - 1`. Increments after each function call.
 * @param fn - The function to invoke. Passed one argument, the current value of `n`.
 * @returns An array containing the return values of all calls to `fn`.
 * @example times(5, identity); //=> [0, 1, 2, 3, 4]
 * @dataFirst
 */
export declare function times<T>(count: number, fn: (n: number) => T): Array<T>;
/**
 * Calls an input function `n` times, returning an array containing the results
 * of those function calls.
 *
 * `fn` is passed one argument: The current value of `n`, which begins at `0`
 * and is gradually incremented to `n - 1`.
 *
 * @param fn - The function to invoke. Passed one argument, the current value of `n`.
 * @returns An array containing the return values of all calls to `fn`.
 * @example times(identity)(5); //=> [0, 1, 2, 3, 4]
 * @dataLast
 */
export declare function times<T>(fn: (n: number) => T): (count: number) => Array<T>;
//# sourceMappingURL=times.d.ts.map