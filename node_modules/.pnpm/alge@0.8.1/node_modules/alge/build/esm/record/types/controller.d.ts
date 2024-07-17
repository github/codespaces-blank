import type { SomeSchema, SomeSchemaDef } from '../../core/internal.js';
import type { Encoder, OmitWithTag, SomeName, StoredRecords } from '../../core/types.js';
import type { OmitRequired, Rest } from '../../lib/utils.js';
import type { z } from '../../lib/z/index.js';
import type { SomeDecodeOrThrowJson, SomeDecoderJson, SomeDefaultsProvider, SomeEncoderJson } from './internal.js';
import type { SomeStoredRecord, StoredRecord } from './StoredRecord.js';
import type { Any } from 'ts-toolbelt';
export declare const getTagProperty: <R extends SomeTaggedRecord<string>>(taggedRecord: R) => GetTagProperty<R>;
export declare const getTag: <R extends SomeTaggedRecord<string>>(taggedRecord: R) => GetTagProperty<R>;
export type GetTag<ADT extends SomeTaggedRecord> = ADT extends {
    __typename: string;
} ? ADT['__typename'] : ADT extends {
    _tag: string;
} ? ADT['_tag'] : ADT extends {
    _type: string;
} ? ADT['_type'] : ADT extends {
    _kind: string;
} ? ADT['_kind'] : ADT extends {
    type: string;
} ? ADT['type'] : ADT extends {
    kind: string;
} ? ADT['kind'] : never;
export type GetTagProperty<TaggedRecord extends SomeTaggedRecord> = TaggedRecord extends {
    __typename: string;
} ? '__typename' : TaggedRecord extends {
    _tag: string;
} ? '_tag' : TaggedRecord extends {
    _type: string;
} ? '_tag' : TaggedRecord extends {
    _kind: string;
} ? '_tag' : TaggedRecord extends {
    type: string;
} ? '_tag' : TaggedRecord extends {
    kind: string;
} ? '_tag' : never;
export type SomeTaggedRecord<Tag extends string = string> = SomeRecord<'__typename', Tag> | SomeRecord<'_tag', Tag> | SomeRecord<'_type', Tag> | SomeRecord<'_kind', Tag> | SomeRecord<'type', Tag> | SomeRecord<'kind', Tag>;
export type SomeRecord<TagPropertyName extends string = '_tag', Tag extends string = string> = {
    [PropertyName in TagPropertyName]: Tag;
};
export type SomeRecordInternal = {
    _tag: string;
    _: {
        tag: string;
    };
};
export type SomeRecordController = {
    _: {
        defaultsProvider: null | SomeDefaultsProvider;
        codecs: [...string[]];
        symbol: symbol;
    };
    name: string;
    schema: SomeSchema;
    is: (record: any) => boolean;
    is$: (value: unknown) => boolean;
    update: (record: any, changes: object) => object;
    create: (params?: any) => any;
    from: {
        json: SomeDecoderJson;
        jsonOrThrow: SomeDecodeOrThrowJson;
    };
    to: {
        json: SomeEncoderJson;
    };
};
type Encoders<Names extends string[], V extends SomeStoredRecord> = Encoders_<{}, Names, V>;
type Encoders_<Obj, Names extends string[], V extends SomeStoredRecord> = Names extends [] ? Obj : Encoders_<Obj & Encoder_<Names[0], V>, Rest<Names>, V>;
type Encoder_<Name extends string, V extends SomeStoredRecord> = {
    [N in Name]: Encoder<V>;
};
type Decoders<Names extends string[], V extends SomeStoredRecord> = Decoders_<{}, Names, V>;
type Decoders_<Obj, Names extends string[], R extends SomeStoredRecord> = Names extends [] ? Obj : Decoders_<Obj & DecoderMethods<Names[0], R>, Rest<Names>, R>;
type DecoderMethods<Name extends string, R extends SomeStoredRecord> = {
    [N in Name]: (value: string) => null | StoredRecord.GetType<R>;
} & {
    [N in Name as `${N}OrThrow`]: (value: string) => StoredRecord.GetType<R>;
};
export declare namespace RecordController {
    export type CreateFromSchema<Name extends SomeName, Schema extends SomeSchema> = Any.Compute<CreateFromStoredRecord<StoredRecord.AddSchema<Schema, StoredRecord.Create<Name>>>, 'flat'>;
    export type CreateFromSchemaDef<Name extends SomeName, SchemaDef extends SomeSchemaDef> = Any.Compute<CreateFromStoredRecord<StoredRecord.AddSchemaDef<SchemaDef, StoredRecord.Create<Name>>>, 'flat'>;
    type CreateFromStoredRecord<R extends SomeStoredRecord> = RecordController<[R], R>;
    export type GetConstructorInput<V extends SomeStoredRecord> = ApplyDefaults<V['defaults'], z.input<z.Omit<V['schema'], {
        _tag: true;
    }>>>;
    export {};
}
export type RecordController<Rs extends StoredRecords, R extends SomeStoredRecord> = {
    _: {
        defaultsProvider: null extends R['defaults'] ? null : SomeDefaultsProvider<object, Exclude<R['defaults'], null>>;
        tag: string;
        symbol: symbol;
        codecs: [...string[]];
    };
    name: R[`name`];
    /**
     *
     * @throws If zod schema violated: bad types, failed validation, throw from a transformer.
     */
    update(record: StoredRecord.GetType<R>, changes: Any.Compute<Partial<OmitWithTag<StoredRecord.GetType<R>>>>): StoredRecord.GetType<R>;
    /**
     * Decoders for this record. Decoders are used to transform other representations of your record back into a record instance.
     */
    from: Any.Compute<{
        /**
         * Decode JSON into this record. If it fails for any reason, returns `null`.
         *
         * @remarks This is a built in decoder.
         */
        json(value: string): null | StoredRecord.GetType<R>;
        /**
         * Decode JSON into this record. Throws if it fails for any reason.
         *
         * @remarks This is a built in decoder.
         */
        jsonOrThrow(value: string): StoredRecord.GetType<R>;
    } & Decoders<R['codec'], R>>;
    /**
     * Encoders for this record. Encoders are used to transform your record into another representation.
     */
    to: Any.Compute<{
        /**
         * Encode an instance of this record into JSON.
         *
         * @remarks This is a built in encoder.
         */
        json(record: StoredRecord.GetType<R>): string;
    } & Encoders<R['codec'], R>>;
    /**
     * Strict predicate/type guard for this record.
     *
     * Unlike `is$` this is typed to only accept records of this ADT.
     *
     * Prefer this function over `is$` since it will catch more errors. For example if you
     * are writing code that you think is dealing with the ADT then this function would catch
     * the error of that not being the case.
     *
     * Use `is$` when you have to deal with situations where you know the value could not be an ADT record, but might be.
     */
    is(value: StoredRecords.Union<Rs>): value is StoredRecord.GetType<R>;
    /**
     * Loose predicate/type guard for this record.
     *
     * Unlike `is` this is typed to accept any value, not just records of this ADT.
     *
     * Use this when you have to deal with situations where you know the value could not be an ADT record, but might be.
     *
     * Prefer `is` over this function since it will catch more errors. For example if you
     * are writing code that you think is dealing with the ADT then `is` would catch
     * the error of that not being the case while this function would not.
     */
    is$(value: unknown): value is StoredRecord.GetType<R>;
} & (keyof RecordController.GetConstructorInput<R> extends never ? {
    /**
     * TODO
     */
    create(): StoredRecord.GetType<R>;
} : keyof OmitRequired<RecordController.GetConstructorInput<R>> extends never ? {
    /**
     * TODO
     */
    create(input?: Any.Compute<RecordController.GetConstructorInput<R>>): StoredRecord.GetType<R>;
} : {
    /**
     * TODO
     */
    create(input: Any.Compute<RecordController.GetConstructorInput<R>>): StoredRecord.GetType<R>;
}) & R[`extensions`] & {
    schema: R['schema'];
};
export type ApplyDefaults<Defaults, Input> = {
    [K in keyof Input as K extends keyof Defaults ? never : K]: Input[K];
} & {
    [K in keyof Input as K extends keyof Defaults ? K : never]?: Input[K];
};
export {};
//# sourceMappingURL=controller.d.ts.map