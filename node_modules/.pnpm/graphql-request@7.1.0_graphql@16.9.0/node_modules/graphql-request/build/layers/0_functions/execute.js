import { execute as graphqlExecute, graphql } from 'graphql';
export const execute = async (input) => {
    switch (typeof input.document) {
        case `string`: {
            return await graphql({
                schema: input.schema,
                source: input.document,
                // contextValue: createContextValue(), // todo
                variableValues: input.variables,
                operationName: input.operationName,
            });
        }
        case `object`: {
            return await graphqlExecute({
                schema: input.schema,
                document: input.document,
                // contextValue: createContextValue(), // todo
                variableValues: input.variables,
                operationName: input.operationName,
            });
        }
        default:
            throw new Error(`Unsupported GraphQL document type: ${String(document)}`);
    }
};
//# sourceMappingURL=execute.js.map