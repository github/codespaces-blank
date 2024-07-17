import { Errors } from '../Errors/index.js'
import { r } from '../lib/r.js'
import type { TupleToObject } from '../lib/utils.js'
import { code, inspect, isEmpty } from '../lib/utils.js'
import { z } from '../lib/z/index.js'
import { record } from '../record/runtime.js'
import type { SomeRecordController, SomeRecordInternal } from '../record/types/controller.js'
import type {
  SomeDecodeOrThrower,
  SomeDecoder,
  SomeEncoder,
  SomeRecordBuilder,
} from '../record/types/internal.js'
import type { Initial } from './types/Builder.js'
import type {
  DataController,
  SomeShortHandRecordSchemaDefs,
  SomeShortHandRecordSchemas,
} from './types/Controller.js'
import type { SomeDataController } from './types/internal.js'
import type { SomeZodObject } from 'zod'

export type SomeAdtMethods = {
  name: string
  schema: null | SomeZodObject | z.ZodUnion<[z.SomeZodObject, ...z.SomeZodObject[]]>
  from: Record<string, SomeDecoder | SomeDecodeOrThrower>
  to: Record<string, SomeEncoder>
}

//prettier-ignore
export function data <Name extends string, ShortHandRecordSchemas extends SomeShortHandRecordSchemas>(name: Name, shortHandRecordSchemas: ShortHandRecordSchemas): DataController.createFromShortHandRecordSchemas<Name, ShortHandRecordSchemas>
//prettier-ignore
export function data <Name extends string, ShortHandRecordDefs extends SomeShortHandRecordSchemaDefs>(name: Name, shortHandRecordSchemaDefinitions: ShortHandRecordDefs): DataController.createFromShortHandRecordSchemaDefs<Name, ShortHandRecordDefs>
/**
 * Define an algebraic data type. There must be at least two members. If all members have a parse function then an ADT level parse function will automatically be derived.
 */
// @ts-expect-error empty init tuple
//prettier-ignore
export function data <Name extends string>(name: Name): Initial<{ name: Name }, []>
//eslint-disable-next-line
export function data<Name extends string>(name: Name, shortHandRecordSchemaDefinitionsOrSchemas?: any) {
  // let currentRecord: null | SomeRecordDefinition = null
  // const records: SomeRecordDefinition[] = []
  let currentRecordBuilder: null | SomeRecordBuilder = null
  const records: SomeRecordController[] = []
  const builder = {
    record: (nameOrRecord: string | SomeRecordController) => {
      if (currentRecordBuilder?._)
        records.push(currentRecordBuilder._.innerChain.done() as SomeRecordController)
      currentRecordBuilder =
        typeof nameOrRecord === `string`
          ? // @ts-expect-error null not allowed by consumers
            (record(nameOrRecord, null, {
              extensions: builder,
            }) as SomeRecordBuilder)
          : // @ts-expect-error null not allowed by consumers
            (record(nameOrRecord.name, null, {
              extensions: builder,
              extend: nameOrRecord,
            }) as SomeRecordBuilder)
      return currentRecordBuilder
    },
    done: () => {
      if (currentRecordBuilder?._)
        records.push(currentRecordBuilder._.innerChain.done() as SomeRecordController)
      if (isEmpty(records)) throw createEmptyRecordsError({ name })

      const recordsMethods = r.pipe(records, r.indexBy(r.prop(`name`)))

      // Get the common codecs. We only need to iterate from the point of view of one
      // record's codecs, so we'll pick the first. We're guaranteed to have at least
      // one record based on the empty check above.
      // eslint-disable-next-line
      const firstRecord = records[0]!
      const commonCodecs = firstRecord._.codecs.filter(
        (codec) => records.length === records.filter((record) => record._.codecs.includes(codec)).length
      )

      const createAdtDecoderMethods = (codec: string): Record<string, SomeDecoder | SomeDecodeOrThrower> => {
        const methods: Record<string, SomeDecoder | SomeDecodeOrThrower> = {
          [codec]: (string: string) => {
            for (const recordMethods of Object.values(recordsMethods)) {
              // @ts-expect-error todo
              // eslint-disable-next-line
              const result = recordMethods.from[codec](string) as object
              if (result) return result
            }
            return null
          },
          [`${codec}OrThrow`]: (string: string) => {
            // @ts-expect-error We know the codec will be there because we defined it above.
            //eslint-disable-next-line
            const data = methods[codec](string) as object | null
            if (data === null)
              throw new Error(
                `Failed to decode value \`${inspect(string)}\` into any of the records for this ADT.`
              )
            return data
          },
        }
        return methods
      }

      const createAdtEncoderMethods = (codec: string): Record<string, SomeEncoder> => {
        const methods = {
          [codec]: (data: SomeRecordInternal) => {
            for (const recordMethods of Object.values(recordsMethods)) {
              // @ts-expect-error todo
              // eslint-disable-next-line
              if (data._tag === recordMethods.name) return recordMethods.to[codec](data)
            }
            throw new Error(`Failed to find an encoder for data: "${inspect(data)}"`)
          },
        }
        return methods
      }

      const ADTMethods: SomeAdtMethods = {
        name,
        schema:
          records.length >= 2
            ? z.union([
                // eslint-disable-next-line
                records[0]!.schema,
                // eslint-disable-next-line
                records[1]!.schema,
                ...records.slice(2).map((_) => _.schema),
              ])
            : records.length === 1
            ? // eslint-disable-next-line
              records[0]!.schema
            : null,
        from: {
          ...createAdtDecoderMethods(`json`),
          ...commonCodecs.reduce(
            (decoderMethods, codec) => ({ ...decoderMethods, ...createAdtDecoderMethods(codec) }),
            {} as Record<string, SomeDecoder>
          ),
        },
        to: {
          ...createAdtEncoderMethods(`json`),
          ...commonCodecs.reduce(
            (encoderMethods, codec) => ({ ...encoderMethods, ...createAdtEncoderMethods(codec) }),
            {} as Record<string, SomeEncoder>
          ),
        },
      }

      const controller = {
        ...ADTMethods,
        ...recordsMethods,
      }

      return controller
    },
  }

  if (shortHandRecordSchemaDefinitionsOrSchemas) {
    let b = builder
    //eslint-disable-next-line
    for (const [name, schemaDefinition] of Object.entries(shortHandRecordSchemaDefinitionsOrSchemas)) {
      // @ts-expect-error todo
      //eslint-disable-next-line
      b = b.record(name).schema(schemaDefinition)
    }
    return b.done()
  }
  // TODO
  // eslint-disable-next-line
  return builder as any
}

const createEmptyRecordsError = (params: { name: string }) =>
  Errors.UserMistake.create(
    `No records defined for ADT ${code(params.name)} but ${code(
      `.done()`
    )} was called. You can only call ${code(
      `.done()`
    )} after your ADT has at least one record defined (via ${code(`.record()`)}).`
  )

export type Infer<ADT extends SomeDataController> = {
  // eslint-ignore-next-line
  '*': z.infer<ADT['schema']>
} & TupleToObject<SchemaToTuple<ADT['schema']['_def']['options']>[number]>

export type InferRecord<Record extends SomeRecordController> = z.infer<Record['schema']>

export type SchemaToTuple<Schemas extends [z.SomeZodObject, ...z.SomeZodObject[]]> = {
  [Index in keyof Schemas]: [z.TypeOf<Schemas[Index]>['_tag'], z.TypeOf<Schemas[Index]>]
}
