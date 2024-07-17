import type { SomeSchema, SomeSchemaDef } from '../../core/internal.js';
import type { SomeName, StoredRecords } from '../../core/types.js';
import type { ObjectValues, OnlyStrings } from '../../lib/utils.js';
import type { RecordController } from '../../record/types/controller.js';
import type { StoredRecord } from '../../record/types/StoredRecord.js';
import type { StoredADT } from './Builder.js';
import type { Any } from 'ts-toolbelt';
export type SomeShortHandRecordSchemaDefs = Record<string, SomeSchemaDef>;
export type SomeShortHandRecordSchemas = Record<string, SomeSchema>;
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
type LastOf<T> = UnionToIntersection<T extends any ? () => T : never> extends () => infer R ? R : never;
type Push<T extends any[], V> = [...T, V];
type TuplifyUnion<T, L = LastOf<T>, N = [T] extends [never] ? true : false> = true extends N ? [] : Push<TuplifyUnion<Exclude<T, L>>, L>;
export declare namespace DataController {
    export type createFromShortHandRecordSchemas<Name extends SomeName, shortHandRecordDefs extends SomeShortHandRecordSchemas> = DataController<StoredADT.Create<Name>, StoredRecordsFromShortHandRecordSchemas<shortHandRecordDefs>>;
    type StoredRecordsFromShortHandRecordSchemas<shortHandRecordDefs extends SomeShortHandRecordSchemas> = OnlyStoredRecords<TuplifyUnion<ObjectValues<{
        [Name in OnlyStrings<keyof shortHandRecordDefs>]: StoredRecord.AddSchema<shortHandRecordDefs[Name], StoredRecord.Create<Name>>;
    }>>>;
    export type createFromShortHandRecordSchemaDefs<Name extends SomeName, shortHandRecordDefs extends SomeShortHandRecordSchemaDefs> = DataController<StoredADT.Create<Name>, StoredRecordsFromShortHandRecordSchemaDefs<shortHandRecordDefs>>;
    type StoredRecordsFromShortHandRecordSchemaDefs<shortHandRecordDefs extends SomeShortHandRecordSchemaDefs> = OnlyStoredRecords<TuplifyUnion<ObjectValues<{
        [Name in OnlyStrings<keyof shortHandRecordDefs>]: StoredRecord.AddSchemaDef<shortHandRecordDefs[Name], StoredRecord.Create<Name>>;
    }>>>;
    type OnlyStoredRecords<t> = t extends StoredRecords ? t : never;
    export {};
}
export type DataController<ADT extends StoredADT, Vs extends StoredRecords> = Any.Compute<ADT & RecordsMethods<Vs> & ADTMethods<Vs>, 'flat'>;
/**
 * Build up the API on the ADT itself:
 *
 * ```ts
 * const A = Alge.create('A')...
 * // A.<...>  <-- Methods here
 * ```
 */
type ADTMethods<Vs extends StoredRecords> = {
    from: Any.Compute<DecoderMethods<'json', Vs> & StoredRecords.GetAdtLevelDecoderMethods<Vs>>;
    to: Any.Compute<EncoderMethods<'json', Vs> & StoredRecords.GetAdtLevelEncoderMethods<Vs>>;
    schema: StoredRecords.ZodUnion<Vs>;
};
/**
 * build up the API for each record defined in the ADT:
 *
 * ```ts
 * const A = Alge.create('A').record('B',...)...
 * // A.B.<...>  <-- Methods here
 * ```
 */
export type RecordsMethods<Vs extends StoredRecords> = {
    [V in Vs[number] as V[`name`]]: Any.Compute<RecordController<Vs, V>, 'flat'>;
};
export type DecoderMethods<Name extends string, Rs extends StoredRecords> = {
    [N in Name]: (value: string) => null | StoredRecords.Union<Rs>;
} & {
    [N in Name as `${N}OrThrow`]: (value: string) => StoredRecords.Union<Rs>;
};
export type EncoderMethods<Name extends string, Vs extends StoredRecords> = {
    [N in Name]: Encoder<Vs>;
};
export type Encoder<Vs extends StoredRecords> = (adt: StoredRecords.Union<Vs>) => string;
export {};
//# sourceMappingURL=Controller.d.ts.map