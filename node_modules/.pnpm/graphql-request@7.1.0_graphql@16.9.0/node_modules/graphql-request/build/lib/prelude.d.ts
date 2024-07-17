import type { ConditionalSimplifyDeep } from 'type-fest/source/conditional-simplify.js';
export type RemoveIndex<T> = {
    [K in keyof T as string extends K ? never : number extends K ? never : K]: T[K];
};
export declare const uppercase: <S extends string>(str: S) => Uppercase<S>;
export declare const callOrIdentity: <T>(value: MaybeLazy<T>) => T;
export type MaybeLazy<T> = T | (() => T);
export declare const zip: <A, B>(a: A[], b: B[]) => [A, B | undefined][];
export declare const HeadersInitToPlainObject: (headers?: HeadersInit) => Record<string, string>;
export declare const HeadersInstanceToPlainObject: (headers: Response["headers"]) => Record<string, string>;
export declare const tryCatch: <$Return, $Throw extends Error = Error>(fn: () => $Return) => $Return extends Promise<any> ? Promise<Awaited<$Return> | $Throw> : $Return | $Throw;
/**
 * Ensure that the given value is an error and return it. If it is not an error than
 * wrap it in one, passing the given value as the error message.
 */
export declare const errorFromMaybeError: (maybeError: unknown) => Error;
export declare const isPromiseLikeValue: (value: unknown) => value is Promise<unknown>;
export declare const casesExhausted: (value: never) => never;
export declare const isPlainObject: (value: unknown) => value is Record<string, unknown>;
export declare const entries: <T extends Record<string, any>>(obj: T) => [keyof T, T[keyof T]][];
export declare const values: <T extends Record<string, unknown>>(obj: T) => T[keyof T][];
export type Exact<$Value, $Constraint> = ($Value extends unknown ? $Constraint extends $Value ? {} extends $Value ? $Constraint : {
    [K in keyof $Value]: Exact<$Value[K], $Constraint[K]>;
} : $Constraint : never) | ($Value extends Narrowable ? $Value : never);
export type Narrowable = string | number | bigint | boolean | [];
export type Letter = LetterLower | LetterUpper;
export type Digit = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';
export type LetterLower = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i' | 'j' | 'k' | 'l' | 'm' | 'n' | 'o' | 'p' | 'q' | 'r' | 's' | 't' | 'u' | 'v' | 'w' | 'x' | 'y' | 'z';
export type LetterUpper = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L' | 'M' | 'N' | 'O' | 'P' | 'Q' | 'R' | 'S' | 'T' | 'U' | 'V' | 'W' | 'X' | 'Y' | 'Z';
export type StringNonEmpty = `${Letter}${string}`;
export type MaybeList<T> = T | T[];
export type NotEmptyObject<T> = keyof T extends never ? never : T;
export type Values<T> = T[keyof T];
export type GetKeyOr<T, Key, Or> = Key extends keyof T ? T[Key] : Or;
export type SimplifyDeep<T> = ConditionalSimplifyDeep<T, Function | Iterable<unknown> | Date, object>;
export type As<T, U> = U extends T ? U : never;
export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;
export type LastOf<T> = UnionToIntersection<T extends any ? () => T : never> extends () => infer R ? R : never;
export type Push<T extends any[], V> = [...T, V];
export type UnionToTuple<T, L = LastOf<T>, N = [T] extends [never] ? true : false> = true extends N ? [] : Push<UnionToTuple<Exclude<T, L>>, L>;
export type CountKeys<T> = keyof T extends never ? 0 : UnionToTuple<keyof T>['length'];
export type IsMultipleKeys<T> = IsMultiple<CountKeys<T>>;
export type IsMultiple<T> = T extends 0 ? false : T extends 1 ? false : true;
export type ExcludeNull<T> = Exclude<T, null>;
export declare const mapValues: <$Obj extends Record<string, any>, $Fn extends (value: $Obj[keyof $Obj], key: keyof $Obj) => any>(object: $Obj, fn: $Fn) => Record<keyof $Obj, ReturnType<$Fn>>;
export type SetProperty<$Obj extends object, $Prop extends keyof $Obj, $Type extends $Obj[$Prop]> = Omit<$Obj, $Prop> & {
    [_ in $Prop]: $Type;
};
export declare const lowerCaseFirstLetter: (s: string) => string;
export declare function assertArray(v: unknown): asserts v is unknown[];
export declare function assertObject(v: unknown): asserts v is object;
export type StringKeyof<T> = keyof T & string;
export type MaybePromise<T> = T | Promise<T>;
export declare const capitalizeFirstLetter: (string: string) => string;
export type SomeAsyncFunction = (...args: unknown[]) => Promise<unknown>;
export type SomeMaybeAsyncFunction = (...args: unknown[]) => MaybePromise<unknown>;
export type Deferred<T> = {
    promise: Promise<T>;
    isResolved: () => boolean;
    resolve: (value: T) => void;
    reject: (error: unknown) => void;
};
export declare const createDeferred: <$T>(options?: {
    strict?: boolean;
}) => Deferred<$T>;
export declare const debug: (...args: any[]) => void;
export declare const debugSub: (...args: any[]) => (...subArgs: any[]) => void;
export type PlusOneUpToTen<n extends number> = n extends 0 ? 1 : n extends 1 ? 2 : n extends 2 ? 3 : n extends 3 ? 4 : n extends 4 ? 5 : n extends 5 ? 6 : n extends 6 ? 7 : n extends 7 ? 8 : n extends 8 ? 9 : n extends 9 ? 10 : never;
export type MinusOneUpToTen<n extends number> = n extends 10 ? 9 : n extends 9 ? 8 : n extends 8 ? 7 : n extends 7 ? 6 : n extends 6 ? 5 : n extends 5 ? 4 : n extends 4 ? 3 : n extends 3 ? 2 : n extends 2 ? 1 : n extends 1 ? 0 : never;
export type findIndexForValue<value, list extends readonly [any, ...any[]]> = findIndexForValue_<value, list, 0>;
type findIndexForValue_<value, list extends readonly [any, ...any[]], i extends number> = value extends list[i] ? i : findIndexForValue_<value, list, PlusOneUpToTen<i>>;
export type FindValueAfter<value, list extends readonly [any, ...any[]]> = list[PlusOneUpToTen<findIndexForValue<value, list>>];
export type ValueOr<value, orValue> = value extends undefined ? orValue : value;
export type FindValueAfterOr<value, list extends readonly [any, ...any[]], orValue> = ValueOr<list[PlusOneUpToTen<findIndexForValue<value, list>>], orValue>;
export type GetLastValue<T extends readonly [any, ...any[]]> = T[MinusOneUpToTen<T['length']>];
export type IsLastValue<value, list extends readonly [any, ...any[]]> = value extends GetLastValue<list> ? true : false;
export type Include<T, U> = T extends U ? T : never;
export declare const partitionErrors: <T>(array: T[]) => [Exclude<T, Error>[], Include<T, Error>[]];
export {};
//# sourceMappingURL=prelude.d.ts.map