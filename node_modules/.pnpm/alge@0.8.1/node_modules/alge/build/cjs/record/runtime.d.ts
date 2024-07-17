import type { SomeSchema, SomeSchemaDef } from '../core/internal.js';
import type { Initial } from './types/builder.js';
import type { RecordController } from './types/controller.js';
import type { SomeCodecDefinition, SomeDefaultsProvider } from './types/internal.js';
import type { SomeStoredRecord } from './types/StoredRecord.js';
export type RecordBuildState = Omit<SomeStoredRecord, 'codec' | 'schema' | 'defaults'> & {
    codecs: [string, SomeCodecDefinition][];
    schema: SomeSchema;
    defaultsProvider: null | SomeDefaultsProvider;
};
export declare function record<Name extends string, Schema extends SomeSchema>(name: Name, zodSchemaObject: Schema): RecordController.CreateFromSchema<Name, Schema>;
export declare function record<Name extends string, SchemaDef extends SomeSchemaDef>(name: Name, schemaDefinition: SchemaDef): RecordController.CreateFromSchemaDef<Name, SchemaDef>;
export declare function record<Name extends string>(name: Name): Initial<Name>;
//# sourceMappingURL=runtime.d.ts.map