export type LazyEvaluator<T = unknown, R = T> = (item: T, index?: number, data?: ReadonlyArray<T>) => LazyResult<R>;
export type LazyResult<T> = LazyEmpty | LazyMany<T> | LazyNext<T>;
type LazyEmpty = {
    done: boolean;
    hasNext: false;
    hasMany?: false | undefined;
    next?: undefined;
};
type LazyNext<T> = {
    done: boolean;
    hasNext: true;
    hasMany?: false | undefined;
    next: T;
};
type LazyMany<T> = {
    done: boolean;
    hasNext: true;
    hasMany: true;
    next: ReadonlyArray<T>;
};
/**
 * Perform left-to-right function composition.
 *
 * @param value - The initial value.
 * @param operations - The list of operations to apply.
 * @signature R.pipe(data, op1, op2, op3)
 * @example
 *    R.pipe(
 *      [1, 2, 3, 4],
 *      R.map(x => x * 2),
 *      arr => [arr[0] + arr[1], arr[2] + arr[3]],
 *    ) // => [6, 14]
 * @dataFirst
 * @category Function
 */
export declare function pipe<A, B>(value: A, op1: (input: A) => B): B;
export declare function pipe<A, B, C>(value: A, op1: (input: A) => B, op2: (input: B) => C): C;
export declare function pipe<A, B, C, D>(value: A, op1: (input: A) => B, op2: (input: B) => C, op3: (input: C) => D): D;
export declare function pipe<A, B, C, D, E>(value: A, op1: (input: A) => B, op2: (input: B) => C, op3: (input: C) => D, op4: (input: D) => E): E;
export declare function pipe<A, B, C, D, E, F>(value: A, op1: (input: A) => B, op2: (input: B) => C, op3: (input: C) => D, op4: (input: D) => E, op5: (input: E) => F): F;
export declare function pipe<A, B, C, D, E, F, G>(value: A, op1: (input: A) => B, op2: (input: B) => C, op3: (input: C) => D, op4: (input: D) => E, op5: (input: E) => F, op6: (input: F) => G): G;
export declare function pipe<A, B, C, D, E, F, G, H>(value: A, op1: (input: A) => B, op2: (input: B) => C, op3: (input: C) => D, op4: (input: D) => E, op5: (input: E) => F, op6: (input: F) => G, op7: (input: G) => H): H;
export declare function pipe<A, B, C, D, E, F, G, H, I>(value: A, op1: (input: A) => B, op2: (input: B) => C, op3: (input: C) => D, op4: (input: D) => E, op5: (input: E) => F, op6: (input: F) => G, op7: (input: G) => H, op8: (input: H) => I): I;
export declare function pipe<A, B, C, D, E, F, G, H, I, J>(value: A, op1: (input: A) => B, op2: (input: B) => C, op3: (input: C) => D, op4: (input: D) => E, op5: (input: E) => F, op6: (input: F) => G, op7: (input: G) => H, op8: (input: H) => I, op9: (input: I) => J): J;
export declare function pipe<A, B, C, D, E, F, G, H, I, J, K>(value: A, op01: (input: A) => B, op02: (input: B) => C, op03: (input: C) => D, op04: (input: D) => E, op05: (input: E) => F, op06: (input: F) => G, op07: (input: G) => H, op08: (input: H) => I, op09: (input: I) => J, op10: (input: J) => K): K;
export declare function pipe<A, B, C, D, E, F, G, H, I, J, K, L>(value: A, op01: (input: A) => B, op02: (input: B) => C, op03: (input: C) => D, op04: (input: D) => E, op05: (input: E) => F, op06: (input: F) => G, op07: (input: G) => H, op08: (input: H) => I, op09: (input: I) => J, op10: (input: J) => K, op11: (input: K) => L): L;
export declare function pipe<A, B, C, D, E, F, G, H, I, J, K, L, M>(value: A, op01: (input: A) => B, op02: (input: B) => C, op03: (input: C) => D, op04: (input: D) => E, op05: (input: E) => F, op06: (input: F) => G, op07: (input: G) => H, op08: (input: H) => I, op09: (input: I) => J, op10: (input: J) => K, op11: (input: K) => L, op12: (input: L) => M): M;
export declare function pipe<A, B, C, D, E, F, G, H, I, J, K, L, M, N>(value: A, op01: (input: A) => B, op02: (input: B) => C, op03: (input: C) => D, op04: (input: D) => E, op05: (input: E) => F, op06: (input: F) => G, op07: (input: G) => H, op08: (input: H) => I, op09: (input: I) => J, op10: (input: J) => K, op11: (input: K) => L, op12: (input: L) => M, op13: (input: M) => N): N;
export declare function pipe<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O>(value: A, op01: (input: A) => B, op02: (input: B) => C, op03: (input: C) => D, op04: (input: D) => E, op05: (input: E) => F, op06: (input: F) => G, op07: (input: G) => H, op08: (input: H) => I, op09: (input: I) => J, op10: (input: J) => K, op11: (input: K) => L, op12: (input: L) => M, op13: (input: M) => N, op14: (input: N) => O): O;
export declare function pipe<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P>(value: A, op01: (input: A) => B, op02: (input: B) => C, op03: (input: C) => D, op04: (input: D) => E, op05: (input: E) => F, op06: (input: F) => G, op07: (input: G) => H, op08: (input: H) => I, op09: (input: I) => J, op10: (input: J) => K, op11: (input: K) => L, op12: (input: L) => M, op13: (input: M) => N, op14: (input: N) => O, op15: (input: O) => P): P;
export {};
//# sourceMappingURL=pipe.d.ts.map