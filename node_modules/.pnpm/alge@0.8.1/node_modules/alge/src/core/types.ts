import type { DecoderMethods, EncoderMethods } from '../data/types/Controller.js'
import type { AssertString, ObjectValues, UnionToIntersection } from '../lib/utils.js'
import type { GetTagProperty, RecordController, SomeTaggedRecord } from '../record/types/controller.js'
import type { SomeStoredRecord, StoredRecord } from '../record/types/StoredRecord.js'
import type { z } from 'zod'

// prettier-ignore
export type OmitWithTag2<TaggedRecord extends SomeTaggedRecord> =
  Omit<TaggedRecord, GetTagProperty<TaggedRecord>>

export type OmitWithTag<T> = Omit<T, '_tag'>

export type ExtensionsBase = Record<string, unknown>

export type SomeName = string

export interface CodecDefinition<V extends SomeStoredRecord = SomeStoredRecord> {
  encode: EncoderDefinition<V>
  decode: DecoderDefinition<V>
}

export interface CodecImplementation<R extends SomeStoredRecord = SomeStoredRecord> {
  to: EncoderDefinition<R>
  from: DecoderDefinition<R>
}

export type EncoderDefinition<R extends SomeStoredRecord> = (record: StoredRecord.GetType<R>) => string

export type Encoder<V extends SomeStoredRecord> = EncoderDefinition<V>

export type ADTEncoder<Vs extends StoredRecords> = (adt: StoredRecords.Union<Vs>) => string

export type DecoderDefinition<V extends SomeStoredRecord> = (
  encodedData: string,
  extensions: V[`extensions`] & { schema: V['schema']; name: V[`name`] }
) => null | RecordController.GetConstructorInput<V>

export type Decoder<V extends SomeStoredRecord> = (value: string) => null | StoredRecord.GetType<V>

export type DecoderThatThrows<V extends SomeStoredRecord> = (value: string) => StoredRecord.GetType<V>

export type ADTDecoder<Vs extends StoredRecords> = (value: string) => null | StoredRecords.Union<Vs>

export type ADTDecoderThatThrows<Vs extends StoredRecords> = (value: string) => StoredRecords.Union<Vs>

export type InputBase = object

export type StoredRecords = [SomeStoredRecord, ...SomeStoredRecord[]]

export type SomeRecordInternals = {
  _: {
    tag: string
  }
}

export type WithSomeRecordInternals<T> = T & SomeRecordInternals

// eslint-disable-next-line
export namespace StoredRecords {
  /**
   * Get the methods for decoders that are defined across all records.
   */
  export type GetAdtLevelDecoderMethods<Vs extends StoredRecords> = UnionToIntersection<
    ObjectValues<{
      [Codec in GetCommonCodecs<Vs>]: DecoderMethods<AssertString<Codec>, Vs>
    }>
  >

  type GetCommonCodecs<Vs extends StoredRecords> = ObjectValues<{
    [Codec in Vs[0]['codec'][number] as IsAllHaveCodec<Codec, Vs> extends true ? Codec : never]: Codec
  }>

  // type Vs = [
  //   StoredRecord.AddCodec<'foo2', StoredRecord.AddCodec<'foo1', CreateStoredRecord<'A'>>>,
  //   StoredRecord.AddCodec<'foo2', StoredRecord.AddCodec<'foo1', CreateStoredRecord<'B'>>>
  // ]
  // type a = GetCommonCodecs<Vs>
  // type b = GetAdtLevelDecoderMethods<Vs>

  /**
   * Get the methods for encoders that are defined across all records.
   */
  export type GetAdtLevelEncoderMethods<Rs extends StoredRecords> = UnionToIntersection<
    ObjectValues<{
      [Codec in GetCommonCodecs<Rs>]: EncoderMethods<AssertString<Codec>, Rs>
    }>
  >

  export type ZodUnion<Rs extends StoredRecords> = z.ZodUnion<RecordsToSchemas<Rs>>

  export type Union<Vs extends StoredRecords> = z.TypeOf<ZodUnion<Vs>>

  export type IsAllHaveCodec<Name extends string, Vs extends StoredRecords> = {
    [I in keyof Vs]: Name extends Vs[I][`codec`][number] ? true : false
  } extends [true, ...true[]]
    ? true
    : false

  export type IsAllHaveParse<Vs extends StoredRecords> = {
    // @ts-expect-error adf
    [K in keyof Vs]: unknown extends Vs[K][1][`parse`] ? `missing` : never
  } extends [never, ...never[]]
    ? true
    : false

  type RecordsToSchemas<Rs extends StoredRecords> = {
    [Index in keyof Rs]: Rs[Index][`schema`]
  }
}
