/**
 * This module is concerned with the static types for the API of building up an ADT.
 */
import type { SomeSchema, SomeSchemaDef } from '../../core/internal.js';
import type { CodecImplementation, ExtensionsBase } from '../../core/types.js';
import type { RecordController } from './controller.js';
import type { SomeDefaultsProvider } from './internal.js';
import type { SomeStoredRecord, StoredRecord } from './StoredRecord.js';
export type SomeDefaults = object;
/**
 * The initial API for building an ADT.
 */
export type Initial<Tag extends string> = PostTag<StoredRecord.Create<Tag>>;
/**
 * The builder API when it is in a state where a record is required.
 *
 * @remarks This happens to be the initial state of the builder API.
 */
export interface PostTag<R extends SomeStoredRecord> extends Done<R> {
    schema<Schema extends SomeSchema>(zodObject: Schema): PostSchema<StoredRecord.AddSchema<Schema, R>>;
    schema<SchemaDef extends SomeSchemaDef>(schemaDefinition: SchemaDef): PostSchema<StoredRecord.AddSchemaDef<SchemaDef, R>>;
    extend<Extensions extends ExtensionsBase>(extensions: Extensions): PostExtend<StoredRecord.AddExtensions<Extensions, R>>;
}
/**
 * The builder API when it is a state of having at least one record defined.
 * At this point the ADT can be marked as done.
 */
export interface PostSchema<R extends SomeStoredRecord> extends Done<R> {
    codec<Name extends string>(name: Name, implementation: CodecImplementation<R>): PostSchema<StoredRecord.AddCodec<Name, R>>;
    defaults<Defaults extends Partial<StoredRecord.GetType<R>>>(defaults: SomeDefaultsProvider<Partial<StoredRecord.GetType<R>>, Defaults>): PostDefaults<StoredRecord.AddDefaults<R, Defaults>>;
    extend<Extensions extends ExtensionsBase>(extensions: Extensions): PostExtend<StoredRecord.AddExtensions<Extensions, R>>;
}
export interface PostExtend<R extends SomeStoredRecord> extends Done<R> {
    defaults<Defaults extends Partial<StoredRecord.GetType<R>>>(defaults: SomeDefaultsProvider<Partial<StoredRecord.GetType<R>>, Defaults>): PostDefaults<StoredRecord.AddDefaults<R, Defaults>>;
    codec<Name extends string>(name: Name, implementation: CodecImplementation<R>): PostExtend<StoredRecord.AddCodec<Name, R>>;
}
export interface PostDefaults<R extends SomeStoredRecord> extends Done<R> {
    codec<Name extends string>(name: Name, implementation: CodecImplementation<R>): PostDefaults<StoredRecord.AddCodec<Name, R>>;
    extend<Extensions extends ExtensionsBase>(extensions: Extensions): PostExtend<StoredRecord.AddExtensions<Extensions, R>>;
}
/**
 * The builder API when it is a state of having at least one record defined.
 * At this point the ADT can be marked as done.
 */
export interface Extend<V extends SomeStoredRecord> {
    /**
     * Extend the ADT with new properties.
     * TODO
     */
    extend<Extensions extends ExtensionsBase>(extensions: Extensions): Extend<StoredRecord.AddExtensions<Extensions, V>>;
}
export interface Done<V extends SomeStoredRecord> {
    done(): RecordController<[V], V>;
}
export type ThisStoredRecord<Name extends string = string> = {
    name: Name;
};
//# sourceMappingURL=builder.d.ts.map