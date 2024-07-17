import { z } from 'zod';
export type SomeBasicParameterType = SomeBasicType | SomeUnionType;
type ZodEnumBase = z.ZodEnum<[string, ...string[]]>;
type ZodNativeEnumBase = z.ZodNativeEnum<any>;
export type SomeBasicType = SomeBasicTypeScalar | z.ZodOptional<SomeBasicTypeScalar> | z.ZodDefault<SomeBasicTypeScalar>;
export type SomeUnionType = SomeUnionTypeScalar | z.ZodOptional<SomeUnionType> | z.ZodDefault<SomeUnionType>;
export type SomeExclusiveZodType = SomeBasicTypeScalar;
export type SomeUnionTypeScalar = z.ZodUnion<[
    SomeBasicTypeScalar,
    SomeBasicTypeScalar,
    ...SomeBasicTypeScalar[]
]>;
export type SomeBasicTypeScalar = z.ZodString | ZodEnumBase | ZodNativeEnumBase | z.ZodNumber | z.ZodBoolean | z.ZodLiteral<number> | z.ZodLiteral<string> | z.ZodLiteral<boolean>;
export declare const isUnionType: (type: SomeBasicType | SomeUnionType) => type is SomeUnionType;
export declare const getUnionScalar: (zodType: SomeUnionType) => SomeUnionTypeScalar;
export declare const getBasicScalar: (zodType: SomeBasicType) => SomeBasicTypeScalar;
export {};
//# sourceMappingURL=zod.d.ts.map