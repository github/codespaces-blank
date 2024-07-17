import type { LazyResult } from "./pipe";
/**
 * A helper evaluator when we want to return an empty result. It memoizes both
 * the result and the evaluator itself to reduce memory usage.
 */
export declare const lazyEmptyEvaluator: <T>() => LazyResult<T>;
/**
 * A helper evaluator when we want to return a shallow clone of the input. It
 * memoizes both the evaluator itself to reduce memory usage.
 */
export declare const lazyIdentityEvaluator: <T>(value: T) => {
    readonly hasNext: true;
    readonly next: T;
    readonly done: false;
};
//# sourceMappingURL=_utilityEvaluators.d.ts.map