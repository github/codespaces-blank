import type { TupleToObject } from '../lib/utils.js';
import { z } from '../lib/z/index.js';
import type { SomeRecordController } from '../record/types/controller.js';
import type { SomeDecodeOrThrower, SomeDecoder, SomeEncoder } from '../record/types/internal.js';
import type { Initial } from './types/Builder.js';
import type { DataController, SomeShortHandRecordSchemaDefs, SomeShortHandRecordSchemas } from './types/Controller.js';
import type { SomeDataController } from './types/internal.js';
import type { SomeZodObject } from 'zod';
export type SomeAdtMethods = {
    name: string;
    schema: null | SomeZodObject | z.ZodUnion<[z.SomeZodObject, ...z.SomeZodObject[]]>;
    from: Record<string, SomeDecoder | SomeDecodeOrThrower>;
    to: Record<string, SomeEncoder>;
};
export declare function data<Name extends string, ShortHandRecordSchemas extends SomeShortHandRecordSchemas>(name: Name, shortHandRecordSchemas: ShortHandRecordSchemas): DataController.createFromShortHandRecordSchemas<Name, ShortHandRecordSchemas>;
export declare function data<Name extends string, ShortHandRecordDefs extends SomeShortHandRecordSchemaDefs>(name: Name, shortHandRecordSchemaDefinitions: ShortHandRecordDefs): DataController.createFromShortHandRecordSchemaDefs<Name, ShortHandRecordDefs>;
/**
 * Define an algebraic data type. There must be at least two members. If all members have a parse function then an ADT level parse function will automatically be derived.
 */
export declare function data<Name extends string>(name: Name): Initial<{
    name: Name;
}, []>;
export type Infer<ADT extends SomeDataController> = {
    '*': z.infer<ADT['schema']>;
} & TupleToObject<SchemaToTuple<ADT['schema']['_def']['options']>[number]>;
export type InferRecord<Record extends SomeRecordController> = z.infer<Record['schema']>;
export type SchemaToTuple<Schemas extends [z.SomeZodObject, ...z.SomeZodObject[]]> = {
    [Index in keyof Schemas]: [z.TypeOf<Schemas[Index]>['_tag'], z.TypeOf<Schemas[Index]>];
};
//# sourceMappingURL=runtime.d.ts.map