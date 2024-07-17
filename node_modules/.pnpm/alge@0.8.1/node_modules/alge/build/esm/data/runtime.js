import { Errors } from '../Errors/index.js';
import { r } from '../lib/r.js';
import { code, inspect, isEmpty } from '../lib/utils.js';
import { z } from '../lib/z/index.js';
import { record } from '../record/runtime.js';
//eslint-disable-next-line
export function data(name, shortHandRecordSchemaDefinitionsOrSchemas) {
    // let currentRecord: null | SomeRecordDefinition = null
    // const records: SomeRecordDefinition[] = []
    let currentRecordBuilder = null;
    const records = [];
    const builder = {
        record: (nameOrRecord) => {
            if (currentRecordBuilder?._)
                records.push(currentRecordBuilder._.innerChain.done());
            currentRecordBuilder =
                typeof nameOrRecord === `string`
                    ? // @ts-expect-error null not allowed by consumers
                        record(nameOrRecord, null, {
                            extensions: builder,
                        })
                    : // @ts-expect-error null not allowed by consumers
                        record(nameOrRecord.name, null, {
                            extensions: builder,
                            extend: nameOrRecord,
                        });
            return currentRecordBuilder;
        },
        done: () => {
            if (currentRecordBuilder?._)
                records.push(currentRecordBuilder._.innerChain.done());
            if (isEmpty(records))
                throw createEmptyRecordsError({ name });
            const recordsMethods = r.pipe(records, r.indexBy(r.prop(`name`)));
            // Get the common codecs. We only need to iterate from the point of view of one
            // record's codecs, so we'll pick the first. We're guaranteed to have at least
            // one record based on the empty check above.
            // eslint-disable-next-line
            const firstRecord = records[0];
            const commonCodecs = firstRecord._.codecs.filter((codec) => records.length === records.filter((record) => record._.codecs.includes(codec)).length);
            const createAdtDecoderMethods = (codec) => {
                const methods = {
                    [codec]: (string) => {
                        for (const recordMethods of Object.values(recordsMethods)) {
                            // @ts-expect-error todo
                            // eslint-disable-next-line
                            const result = recordMethods.from[codec](string);
                            if (result)
                                return result;
                        }
                        return null;
                    },
                    [`${codec}OrThrow`]: (string) => {
                        // @ts-expect-error We know the codec will be there because we defined it above.
                        //eslint-disable-next-line
                        const data = methods[codec](string);
                        if (data === null)
                            throw new Error(`Failed to decode value \`${inspect(string)}\` into any of the records for this ADT.`);
                        return data;
                    },
                };
                return methods;
            };
            const createAdtEncoderMethods = (codec) => {
                const methods = {
                    [codec]: (data) => {
                        for (const recordMethods of Object.values(recordsMethods)) {
                            // @ts-expect-error todo
                            // eslint-disable-next-line
                            if (data._tag === recordMethods.name)
                                return recordMethods.to[codec](data);
                        }
                        throw new Error(`Failed to find an encoder for data: "${inspect(data)}"`);
                    },
                };
                return methods;
            };
            const ADTMethods = {
                name,
                schema: records.length >= 2
                    ? z.union([
                        // eslint-disable-next-line
                        records[0].schema,
                        // eslint-disable-next-line
                        records[1].schema,
                        ...records.slice(2).map((_) => _.schema),
                    ])
                    : records.length === 1
                        ? // eslint-disable-next-line
                            records[0].schema
                        : null,
                from: {
                    ...createAdtDecoderMethods(`json`),
                    ...commonCodecs.reduce((decoderMethods, codec) => ({ ...decoderMethods, ...createAdtDecoderMethods(codec) }), {}),
                },
                to: {
                    ...createAdtEncoderMethods(`json`),
                    ...commonCodecs.reduce((encoderMethods, codec) => ({ ...encoderMethods, ...createAdtEncoderMethods(codec) }), {}),
                },
            };
            const controller = {
                ...ADTMethods,
                ...recordsMethods,
            };
            return controller;
        },
    };
    if (shortHandRecordSchemaDefinitionsOrSchemas) {
        let b = builder;
        //eslint-disable-next-line
        for (const [name, schemaDefinition] of Object.entries(shortHandRecordSchemaDefinitionsOrSchemas)) {
            // @ts-expect-error todo
            //eslint-disable-next-line
            b = b.record(name).schema(schemaDefinition);
        }
        return b.done();
    }
    // TODO
    // eslint-disable-next-line
    return builder;
}
const createEmptyRecordsError = (params) => Errors.UserMistake.create(`No records defined for ADT ${code(params.name)} but ${code(`.done()`)} was called. You can only call ${code(`.done()`)} after your ADT has at least one record defined (via ${code(`.record()`)}).`);
//# sourceMappingURL=runtime.js.map