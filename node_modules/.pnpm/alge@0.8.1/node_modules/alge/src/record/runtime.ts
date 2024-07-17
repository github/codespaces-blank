import { is } from '../core/helpers.js'
import type { SomeSchema, SomeSchemaDef } from '../core/internal.js'
import type { ExtensionsBase } from '../core/types.js'
import { applyDefaults, extendChain, isEmptySchema, tryOrNull } from '../lib/utils.js'
import { z } from '../lib/z/index.js'
import type { Initial } from './types/builder.js'
import type { RecordController, SomeRecordController } from './types/controller.js'
import type {
  SomeCodecDefinition,
  SomeDefaultsProvider,
  SomeRecordConstructorInput,
} from './types/internal.js'
import type { SomeStoredRecord } from './types/StoredRecord.js'

export type RecordBuildState = Omit<SomeStoredRecord, 'codec' | 'schema' | 'defaults'> & {
  codecs: [string, SomeCodecDefinition][]
  schema: SomeSchema
  defaultsProvider: null | SomeDefaultsProvider
}

//prettier-ignore
export function record<Name extends string, Schema extends SomeSchema>(name: Name, zodSchemaObject: Schema): RecordController.CreateFromSchema<Name, Schema>
//prettier-ignore
export function record<Name extends string, SchemaDef extends SomeSchemaDef>(name: Name, schemaDefinition: SchemaDef): RecordController.CreateFromSchemaDef<Name, SchemaDef>
//prettier-ignore
export function record<Name extends string>(name: Name): Initial<Name>
//eslint-disable-next-line
export function record<Name extends string>(
  name: Name,
  schemaOrSchemaDef?: SomeSchema | SomeSchemaDef,
  _: {
    extensions?: object
    extend?: SomeRecordController
  } = {}
) {
  const chainTerminus = `done`
  const initialSchema = z.object({ _tag: z.literal(name) })
  const current: RecordBuildState = {
    name,
    schema: initialSchema,
    extensions: {},
    defaultsProvider: null,
    codecs: [],
    ...(_.extend
      ? {
          name: _.extend.name,
          schema: _.extend.schema,
          defaultsProvider: _.extend._.defaultsProvider,
          extensions: _.extend,
        }
      : {}),
  }

  const chain = {
    schema: (schemaOrSchemaDef: SomeSchemaDef | SomeSchema) => {
      if (`_def` in schemaOrSchemaDef) {
        // @ts-expect-error: TODO
        // eslint-disable-next-line
        current.schema = schemaOrSchemaDef.extend({ _tag: z.literal(current.name) })
      } else {
        current.schema = z.object({ ...schemaOrSchemaDef, _tag: z.literal(current.name) })
      }
      return chain
    },
    extend: (extensions: ExtensionsBase) => {
      current.extensions = {
        ...current.extensions,
        ...extensions,
      }
      return chain
    },
    codec: (name: string, codecDef: SomeCodecDefinition) => {
      // TODO optimize this check to be O(1)
      if (!isEmptySchema(current.schema)) throw new Error(`A codec cannot be defined without a schema.`)
      if (current.codecs.find((codec) => codec[0] === name))
        throw new Error(`A codec with the name "${name}" has already been defined.`)
      current.codecs.push([name, codecDef])
      return chain
    },
    defaults: (defaultsProvider: SomeDefaultsProvider) => {
      if (current.schema === initialSchema) throw new Error(`No schema defined.`)
      if (current.defaultsProvider) throw new Error(`Defaults already defined.`)
      current.defaultsProvider = defaultsProvider
      return chain
    },
    done: () => {
      const symbol = Symbol(current.name)
      const controller: SomeRecordController = {
        ...current,
        _: {
          symbol,
          codecs: current.codecs.map((_) => _[0]),
          defaultsProvider: current.defaultsProvider,
        },
        create: (input: SomeRecordConstructorInput) => {
          const data = {
            ...applyDefaults(input ?? {}, current.defaultsProvider?.(input ?? {}) ?? {}),
            _tag: current.name,
            _: {
              symbol,
              tag: current.name,
            },
          }
          return current.schema.passthrough().parse(data) as object
        },
        //eslint-disable-next-line
        is$: (value) => is(value, symbol),
        is: (record) => is(record, symbol),
        update: (record, changes) => {
          return controller.create({
            ...record,
            ...changes,
          }) as object
        },
        from: {
          json: (json: string) => {
            const data = tryOrNull(() => JSON.parse(json) as object)
            if (data === null || typeof data !== `object`) return null
            // TODO
            // eslint-disable-next-line
            return controller.create(data)
          },
          jsonOrThrow: (json) => {
            const data = controller.from.json(json)
            if (data === null) throw new Error(`Failed to decode value \`${json}\` into a ${name}.`)
            return data
          },
          ...current.codecs.reduce(
            (acc, [key, impl]) =>
              Object.assign(acc, {
                [key]: (value: string) => {
                  const data = impl.from(value, {
                    ...current.extensions,
                    schema: current.schema,
                    name: current.name,
                  })
                  if (data === null) return null
                  // TODO
                  // eslint-disable-next-line
                  return controller.create(data)
                },
                [`${key}OrThrow`]: (value: string) => {
                  // @ts-expect-error not indexable
                  // eslint-disable-next-line
                  const data = controller.from[key](value) as object | null
                  if (data === null) throw new Error(`Failed to decode value \`${value}\` into a ${name}.`)
                  return data
                },
              }),
            {}
          ),
        },
        to: {
          json: (data) => {
            return JSON.stringify(data)
          },
          ...current.codecs.reduce(
            (acc, [key, impl]) =>
              Object.assign(acc, {
                [key]: (recordController: SomeRecordController) => {
                  return impl.to(recordController)
                },
              }),
            {}
          ),
        },
        ...current.extensions,
      }
      return controller
    },
  }

  const chainWrapped = _.extensions
    ? extendChain({
        chain: {
          terminus: chainTerminus,
          // TODO
          // @ts-expect-error something about chain not having an index signature.
          methods: chain,
        },
        extensions: _.extensions,
      })
    : chain

  if (schemaOrSchemaDef) {
    return chain.schema(schemaOrSchemaDef).done()
  }

  // TODO
  // eslint-disable-next-line
  return chainWrapped as any
}
