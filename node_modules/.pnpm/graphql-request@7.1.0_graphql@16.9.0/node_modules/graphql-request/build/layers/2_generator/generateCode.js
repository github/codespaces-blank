import { buildSchema } from 'graphql';
import * as Path from 'node:path';
import { getTypeMapByKind } from '../../lib/graphql.js';
import { generate_ } from './code/_.js';
import { generate__ } from './code/__.js';
import { generateClient } from './code/Client.js';
import { generateError } from './code/Error.js';
import { generateGlobal } from './code/global.js';
import { generateIndex } from './code/Index.js';
import { generateScalar } from './code/Scalar.js';
import { generateSchemaBuildtime } from './code/SchemaBuildtime.js';
import { generateRuntimeSchema } from './code/SchemaRuntime.js';
import { generateSelect } from './code/Select.js';
export const defaultName = `default`;
export const resolveOptions = (input) => {
    const errorTypeNamePattern = input.options?.errorTypeNamePattern ?? null;
    const schema = buildSchema(input.schemaSource);
    const typeMapByKind = getTypeMapByKind(schema);
    const errorObjects = errorTypeNamePattern
        ? Object.values(typeMapByKind.GraphQLObjectType).filter(_ => _.name.match(errorTypeNamePattern))
        : [];
    return {
        name: input.name ?? defaultName,
        schema,
        error: {
            enabled: Boolean(errorTypeNamePattern),
            objects: errorObjects,
        },
        importPaths: {
            customScalarCodecs: input.importPaths?.customScalarCodecs ?? Path.join(process.cwd(), `customScalarCodecs.js`),
        },
        libraryPaths: {
            client: input.libraryPaths?.client ?? `graphql-request/alpha/client`,
            scalars: input.libraryPaths?.scalars ?? `graphql-request/alpha/schema/scalars`,
            schema: input.libraryPaths?.schema ?? `graphql-request/alpha/schema`,
        },
        typeMapByKind,
        rootTypes: {
            Query: typeMapByKind.GraphQLRootType.find(_ => _.name === `Query`) ?? null,
            Mutation: typeMapByKind.GraphQLRootType.find(_ => _.name === `Mutation`) ?? null,
            Subscription: typeMapByKind.GraphQLRootType.find(_ => _.name === `Subscription`) ?? null,
        },
        options: {
            errorTypeNamePattern,
            customScalars: input.options?.customScalars ?? false,
            TSDoc: {
                noDocPolicy: input.options?.TSDoc?.noDocPolicy ?? `ignore`,
            },
        },
    };
};
export const generateCode = (input) => {
    const defaultDprintConfig = {
        quoteStyle: `preferSingle`,
        semiColons: `asi`,
    };
    const format = (source) => input.options?.formatter?.formatText(`memory.ts`, source, defaultDprintConfig) ?? source;
    const config = resolveOptions(input);
    return [
        generate__,
        generate_,
        generateClient,
        generateGlobal,
        generateError,
        generateIndex,
        generateScalar,
        generateSchemaBuildtime,
        generateRuntimeSchema,
        generateSelect,
    ].map(_ => _(config)).map(code => ({
        ...code,
        code: format(code.code),
    }));
};
//# sourceMappingURL=generateCode.js.map