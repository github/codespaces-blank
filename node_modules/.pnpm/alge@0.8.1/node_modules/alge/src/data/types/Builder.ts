/**
 * This module is concerned with the static types for the API of building up an ADT.
 */

import type { SomeSchema, SomeSchemaDef } from '../../core/internal.js'
import type { CodecImplementation, ExtensionsBase, SomeName, StoredRecords } from '../../core/types.js'
import type { SomeRecordController } from '../../record/types/controller.js'
import type { SomeStoredRecord, StoredRecord } from '../../record/types/StoredRecord.js'
import type { DataController } from './Controller.js'

/**
 * The initial API for building an ADT.
 */
export type Initial<ADT extends StoredADT, Rs extends StoredRecords> = RecordRequired<ADT, Rs>

/**
 * The builder API when it is in a state where a record is required.
 *
 * @remarks This happens to be the initial state of the builder API.
 */
// prettier-ignore
export interface RecordRequired<ADT extends StoredADT, Rs extends StoredRecords> {
  record<Name extends string>(name: Name): PostRecord<ADT, StoredRecord.Create<Name>, Rs>
  record<RC extends SomeRecordController>(recordController: RC): PostRecord<ADT, StoredRecord.CreateFromRecordController<RC>, Rs>
}

/**
 * The builder API when it is in a state where a record is required.
 *
 * @remarks This happens to be the initial state of the builder API.
 */
// prettier-ignore
export interface PostRecord<ADT extends StoredADT, R extends SomeStoredRecord, Vs extends StoredRecords>
       extends RecordRequired<ADT, [R, ...Vs]>,
               Done<ADT, R, Vs> {
  schema<Schema extends SomeSchema>(schema: Schema): PostSchema<ADT, StoredRecord.AddSchema<Schema, R>, Vs>
  schema<SchemaDef extends SomeSchemaDef>(schemaDefinition: SchemaDef): PostSchema<ADT, StoredRecord.AddSchemaDef<SchemaDef, R>, Vs>
}

/**
 * The builder API when it is a state of having at least one record defined.
 * At this point the ADT can be marked as done.
 */
// prettier-ignore
export interface PostSchema<ADT extends StoredADT, R extends SomeStoredRecord, Rs extends StoredRecords>
       extends RecordRequired<ADT, [R, ...Rs]>,
               Done<ADT, R, Rs> {
  codec<Name extends string>(name: Name, implementation: CodecImplementation<R>): PostSchema<ADT, StoredRecord.AddCodec<Name, R>, Rs>
  extend<Extensions extends ExtensionsBase>(extensions: Extensions): PostSchema<ADT, StoredRecord.AddExtensions<Extensions, R>, Rs>
}

export interface Done<ADT extends StoredADT, R extends SomeStoredRecord, Rs extends StoredRecords> {
  done(): DataController<ADT, [R, ...Rs]>
}

// Helpers

export type StoredADT<Name extends SomeName = SomeName> = {
  name: Name
}

export namespace StoredADT {
  export type Create<Name extends SomeName = SomeName> = StoredADT<Name>
}
