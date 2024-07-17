import type { Simplify } from 'type-fest';
export declare const _ = "*";
export type SomeData = SomeDataObject | SomeDataScalar;
type SomeDataObject = object;
type SomeDataScalar = number | string | boolean | null;
export type Pattern<Data extends SomeData, DiscriminantProperty extends null | keyof Data = null> = Or<Data extends SomeDataScalar ? Data : PatternForObject<Exclude<Data, SomeDataScalar>, DiscriminantProperty>>;
export type PatternForValue<Data extends SomeData> = Data extends SomeDataScalar ? Data : PatternForObject<Exclude<Data, SomeDataScalar>>;
export type PatternForObject<Data extends SomeDataObject, DiscriminantProperty extends null | keyof Data = null> = {
    [K in Exclude<keyof Data, DiscriminantProperty>]?: Simplify<Data[K] extends Array<any> ? Or<PatternForValue<Data[K][number]>[]> : Data[K] extends SomeDataObject ? Or<PatternForObject<Data[K]>> : Or<Data[K]>>;
} & (null extends DiscriminantProperty ? {} : {
    [K in Exclude<DiscriminantProperty, null>]: Data[K];
});
type Or<T> = T | T[];
export declare const match: <D extends SomeData, P extends Pattern<D, null> | undefined>(data: D, pattern: P) => boolean;
export {};
//# sourceMappingURL=Pattern.d.ts.map