import type { RenameKey } from '../prelude.js';
import type { Any } from 'ts-toolbelt';
import { z } from 'zod';
export type ZodDateCheck = Any.Compute<RenameKey<z.ZodDateCheck, 'kind', '_tag'>>;
export type ZodNumberCheck = Any.Compute<RenameKey<z.ZodNumberCheck, 'kind', '_tag'>>;
export type ZodStringCheck = Any.Compute<RenameKey<z.ZodStringCheck, 'kind', '_tag'>>;
export type ZodPrimitive = 'ZodBoolean' | 'ZodNumber' | 'ZodString' | 'ZodEnum';
export type Primitive = 'boolean' | 'number' | 'string';
export declare const stripOptionalAndDefault: <T extends z.ZodFirstPartySchemaTypes>(type: T) => Exclude<T, z.ZodOptional<any> | z.ZodDefault<any>>;
export declare const isUnion: (type: z.ZodFirstPartySchemaTypes) => boolean;
export declare const isOptional: (schema: z.ZodTypeAny) => boolean;
export declare const getEnum: (type: z.ZodTypeAny) => null | z.ZodEnum<[string, ...string[]]>;
export declare const getZodPrimitive: (schema: z.ZodTypeAny) => ZodPrimitive;
export declare const ZodPrimitiveToPrimitive: {
    readonly ZodBoolean: "boolean";
    readonly ZodString: "string";
    readonly ZodEnum: "string";
    readonly ZodNumber: "number";
};
//# sourceMappingURL=index_.d.ts.map