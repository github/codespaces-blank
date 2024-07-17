import type { SomeSchema, SomeSchemaDef } from '../../core/internal.js';
import type { ExtensionsBase, SomeName } from '../../core/types.js';
import type { SomeDefaults } from './builder.js';
import type { SomeRecordController } from './controller.js';
import type { z } from 'zod';
export type SomeStoredRecord = {
    name: string;
    schema: SomeSchema;
    codec: [...string[]];
    extensions: ExtensionsBase;
    defaults: null | SomeDefaults;
};
export declare namespace StoredRecord {
    type Create<Name extends SomeName> = {
        name: Name;
        schema: z.ZodObject<{
            _tag: z.ZodLiteral<Name>;
        }>;
        codec: [];
        extensions: {};
        defaults: null;
    };
    type CreateFromRecordController<RC extends SomeRecordController> = {
        name: RC['name'];
        schema: RC['schema'];
        codec: RC['_']['codecs'];
        extensions: Omit<RC, 'symbol' | 'create' | 'name' | 'schema' | 'encode' | 'decode' | 'is' | '$is'>;
        defaults: null extends RC['_']['defaultsProvider'] ? null : ReturnType<Exclude<RC['_']['defaultsProvider'], null>>;
    };
    type AddSchema<Schema extends SomeSchema, V extends SomeStoredRecord> = Omit<V, `schema`> & {
        schema: z.ZodObject<z.objectUtil.MergeShapes<Schema['shape'], {
            _tag: z.ZodLiteral<V['name']>;
        }>>;
    };
    type AddSchemaDef<Schema extends SomeSchemaDef, V extends SomeStoredRecord> = Omit<V, `schema`> & {
        schema: z.ZodObject<Schema & {
            _tag: z.ZodLiteral<V['name']>;
        }>;
    };
    type AddCodec<Name extends string, V extends SomeStoredRecord> = Omit<V, `codec`> & {
        codec: [Name, ...V['codec']];
    };
    type AddDefaults<V extends SomeStoredRecord, Defaults> = Omit<V, `defaults`> & {
        defaults: Defaults;
    };
    type AddExtensions<Extensions extends ExtensionsBase, V extends SomeStoredRecord> = V & {
        extensions: Extensions;
    };
    type GetType<R extends SomeStoredRecord> = z.TypeOf<R[`schema`]>;
}
//# sourceMappingURL=StoredRecord.d.ts.map