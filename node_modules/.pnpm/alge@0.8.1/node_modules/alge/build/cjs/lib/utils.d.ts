import type { z } from 'zod';
export declare const inspect: (value: unknown) => string;
/**
 * @see https://stackoverflow.com/questions/50374908/transform-union-type-to-intersection-type?noredirect=1&lq=1
 */
export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
export type AssertString<T> = T extends string ? T : never;
export type ObjectValues<T> = T[keyof T];
/**
 * Is the data type schema empty? Empty means it has no properties beyond the standard `_tag` property.
 */
export declare const isEmptySchema: (schema: z.SomeZodObject) => boolean;
export declare const tryOrNull: <T extends unknown>(fn: () => T) => T | null;
export type Rest<x extends unknown[]> = x extends [infer _first, ...infer rest] ? rest : [];
export type IndexKeys<A extends readonly unknown[]> = Exclude<keyof A, keyof []>;
export type OnlyStrings<x extends unknown> = x extends string ? x : never;
export type OmitRequired<T extends unknown> = {
    [K in keyof T as undefined extends T[K] ? never : K]: T[K];
};
export type IsUnknown<T extends unknown> = IsEqual<T, unknown>;
export type IsEqual<T extends unknown, U extends unknown> = [T] extends [U] ? [U] extends [T] ? true : false : false;
export type TupleToObject<T extends [string, any]> = {
    [key in T[0]]: Extract<T, [key, any]>[1];
};
export type CreateObject<key extends string, Value> = {
    [k in key]: Value;
};
export declare const isEmpty: (value: unknown[] | object) => boolean;
export declare const ensurePeriod: (s: string) => string;
export declare const code: (s: string) => string;
/**
 * Cast the value to `any`
 */
export declare const asAny: (x: any) => any;
/**
 * Extend a chaining API with new methods.
 */
export declare const extendChain: (params: {
    chain: {
        terminus: string;
        methods: Record<string, (...args: unknown[]) => unknown>;
    };
    extensions: object;
}) => {
    _: {
        innerChain: Record<string, (...args: unknown[]) => unknown>;
    };
};
export declare const applyDefaults: (input: object, defaults: object) => {};
//# sourceMappingURL=utils.d.ts.map