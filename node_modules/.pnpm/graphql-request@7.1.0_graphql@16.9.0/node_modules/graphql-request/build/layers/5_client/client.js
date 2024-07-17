import { GraphQLSchema } from 'graphql';
import { Errors } from '../../lib/errors/__.js';
import { isOperationTypeName, operationTypeNameToRootTypeName } from '../../lib/graphql.js';
import { isPlainObject } from '../../lib/prelude.js';
import { Schema } from '../1_Schema/__.js';
import { readMaybeThunk } from '../1_Schema/core/helpers.js';
import { Core } from '../5_core/__.js';
const isTypedContext = (context) => `schemaIndex` in context;
export const createPrefilled = (name, schemaIndex) => {
    // eslint-disable-next-line
    // @ts-ignore passes after generation
    return (input) => create({ ...input, name, schemaIndex });
};
export const create = (input_) => createInternal(input_, { extensions: [], retry: undefined });
export const createInternal = (input_, state) => {
    // eslint-disable-next-line
    // @ts-ignore passes after generation
    const input = input_;
    /**
     * @remarks Without generation the type of returnMode can be `ReturnModeTypeBase` which leads
     * TS to think some errors below are invalid checks because of a non-present member.
     * However our implementation here needs to be generic and support all return modes
     * so we force cast it as such.
     */
    const returnMode = input.returnMode ?? `data`;
    const executeRootType = async (context, rootTypeName, rootTypeSelectionSet) => {
        const transport = input.schema instanceof GraphQLSchema ? `memory` : `http`;
        const interface_ = `typed`;
        const initialInput = {
            interface: interface_,
            transport,
            selection: rootTypeSelectionSet,
            rootTypeName,
            schema: input.schema,
            context: {
                config: context.config,
                transport,
                interface: interface_,
                schemaIndex: context.schemaIndex,
            },
        };
        return await run(context, initialInput);
    };
    const executeRootTypeField = async (context, rootTypeName, rootTypeFieldName, argsOrSelectionSet) => {
        const selectedType = readMaybeThunk(context.schemaIndex.Root[rootTypeName]?.fields[rootTypeFieldName]?.type);
        const selectedNamedType = readMaybeThunk(
        // eslint-disable-next-line
        // @ts-ignore excess depth error
        Schema.Output.unwrapToNamed(selectedType));
        if (!selectedNamedType)
            throw new Error(`${rootTypeName} field not found: ${String(rootTypeFieldName)}`); // eslint-disable-line
        // @ts-expect-error fixme
        const isSelectedTypeScalarOrTypeName = selectedNamedType.kind === `Scalar` || selectedNamedType.kind === `typename`; // todo fix type here, its valid
        const isFieldHasArgs = Boolean(context.schemaIndex.Root[rootTypeName]?.fields[rootTypeFieldName]?.args);
        // We should only need to add __typename for result type fields, but the return handler doesn't yet know how to look beyond a plain object type so we have to add all those cases here.
        const needsTypenameAdded = context.config.returnMode === `successData`
            && (selectedNamedType.kind === `Object` || selectedNamedType.kind === `Interface`
                || selectedNamedType.kind === `Union`);
        const rootTypeFieldSelectionSet = isSelectedTypeScalarOrTypeName
            ? isFieldHasArgs && argsOrSelectionSet ? { $: argsOrSelectionSet } : true
            : needsTypenameAdded
                ? { ...argsOrSelectionSet, __typename: true }
                : argsOrSelectionSet;
        const result = await executeRootType(context, rootTypeName, {
            [rootTypeFieldName]: rootTypeFieldSelectionSet,
        });
        if (result instanceof Error)
            return result;
        return context.config.returnMode === `data` || context.config.returnMode === `dataAndErrors`
            || context.config.returnMode === `successData`
            // @ts-expect-error
            ? result[rootTypeFieldName]
            : result;
    };
    const createRootTypeMethods = (context, rootTypeName) => {
        return new Proxy({}, {
            get: (_, key) => {
                if (typeof key === `symbol`)
                    throw new Error(`Symbols not supported.`);
                // todo We need to document that in order for this to 100% work none of the user's root type fields can end with "OrThrow".
                const isOrThrow = key.endsWith(`OrThrow`);
                const contextWithReturnModeSet = isOrThrow ? applyOrThrowToContext(context) : context;
                if (key.startsWith(`$batch`)) {
                    return async (selectionSetOrIndicator) => executeRootType(contextWithReturnModeSet, rootTypeName, selectionSetOrIndicator);
                }
                else {
                    const fieldName = isOrThrow ? key.slice(0, -7) : key;
                    return (selectionSetOrArgs) => executeRootTypeField(contextWithReturnModeSet, rootTypeName, fieldName, selectionSetOrArgs);
                }
            },
        });
    };
    const context = {
        retry: state.retry,
        extensions: state.extensions,
        config: {
            returnMode,
        },
    };
    const run = async (context, initialInput) => {
        const result = await Core.anyware.run({
            initialInput,
            retryingExtension: context.retry,
            extensions: context.extensions,
        });
        return handleReturn(context, result);
    };
    const runRaw = async (context, rawInput) => {
        const interface_ = `raw`;
        const transport = input.schema instanceof GraphQLSchema ? `memory` : `http`;
        const initialInput = {
            interface: interface_,
            transport,
            document: rawInput.document,
            schema: input.schema,
            context: {
                config: context.config,
            },
        };
        return await run(context, initialInput);
    };
    // @ts-expect-error ignoreme
    const client = {
        raw: async (rawInput) => {
            const contextWithReturnModeSet = updateContextConfig(context, { returnMode: `graphql` });
            return await runRaw(contextWithReturnModeSet, rawInput);
        },
        rawOrThrow: async (rawInput) => {
            const contextWithReturnModeSet = updateContextConfig(context, { returnMode: `graphqlSuccess` });
            return await runRaw(contextWithReturnModeSet, rawInput);
        },
        extend: (extension) => {
            // todo test that adding extensions returns a copy of client
            return createInternal(input, { extensions: [...state.extensions, extension] });
        },
        retry: (extension) => {
            return createInternal(input, { ...state, retry: extension });
        },
    };
    // todo extract this into constructor "create typed client"
    if (input.schemaIndex) {
        const typedContext = {
            ...context,
            schemaIndex: input.schemaIndex,
        };
        Object.assign(client, {
            document: (documentObject) => {
                const hasMultipleOperations = Object.keys(documentObject).length > 1;
                const processInput = (maybeOperationName) => {
                    if (!maybeOperationName && hasMultipleOperations) {
                        throw {
                            errors: [new Error(`Must provide operation name if query contains multiple operations.`)],
                        };
                    }
                    if (maybeOperationName && !(maybeOperationName in documentObject)) {
                        throw {
                            errors: [new Error(`Unknown operation named "${maybeOperationName}".`)],
                        };
                    }
                    const operationName = maybeOperationName ? maybeOperationName : Object.keys(documentObject)[0];
                    const rootTypeSelection = documentObject[operationName];
                    if (!rootTypeSelection)
                        throw new Error(`Operation with name ${operationName} not found.`);
                    const operationTypeName = Object.keys(rootTypeSelection)[0];
                    if (!isOperationTypeName(operationTypeName))
                        throw new Error(`Operation has no selection set.`);
                    // @ts-expect-error
                    const selection = rootTypeSelection[operationTypeName];
                    return {
                        rootTypeName: operationTypeNameToRootTypeName[operationTypeName],
                        selection,
                    };
                };
                return {
                    run: async (maybeOperationName) => {
                        const { selection, rootTypeName } = processInput(maybeOperationName);
                        return await executeRootType(typedContext, rootTypeName, selection);
                    },
                    runOrThrow: async (maybeOperationName) => {
                        const { selection, rootTypeName } = processInput(maybeOperationName);
                        return await executeRootType(applyOrThrowToContext(typedContext), rootTypeName, selection);
                    },
                };
            },
            query: createRootTypeMethods(typedContext, `Query`),
            mutation: createRootTypeMethods(typedContext, `Mutation`),
            // todo
            // subscription: async () => {},
        });
    }
    return client;
};
const handleReturn = (context, result) => {
    switch (context.config.returnMode) {
        case `graphqlSuccess`:
        case `dataAndErrors`:
        case `successData`:
        case `data`: {
            if (result instanceof Error || (result.errors && result.errors.length > 0)) {
                const error = result instanceof Error ? result : (new Errors.ContextualAggregateError(`One or more errors in the execution result.`, {}, result.errors));
                if (context.config.returnMode === `data` || context.config.returnMode === `successData`
                    || context.config.returnMode === `graphqlSuccess`)
                    throw error;
                return error;
            }
            if (isTypedContext(context)) {
                if (context.config.returnMode === `successData`) {
                    if (!isPlainObject(result.data))
                        throw new Error(`Expected data to be an object.`);
                    const schemaErrors = Object.entries(result.data).map(([rootFieldName, rootFieldValue]) => {
                        // todo this check would be nice but it doesn't account for aliases right now. To achieve this we would
                        // need to have the selection set available to use and then do a costly analysis for all fields that were aliases.
                        // So costly that we would probably instead want to create an index of them on the initial encoding step and
                        // then make available down stream. Also, note, here, the hardcoding of Query, needs to be any root type.
                        // const isResultField = Boolean(schemaIndex.error.rootResultFields.Query[rootFieldName])
                        // if (!isResultField) return null
                        // if (!isPlainObject(rootFieldValue)) return new Error(`Expected result field to be an object.`)
                        if (!isPlainObject(rootFieldValue))
                            return null;
                        const __typename = rootFieldValue[`__typename`];
                        if (typeof __typename !== `string`)
                            throw new Error(`Expected __typename to be selected and a string.`);
                        const isErrorObject = Boolean(context.schemaIndex.error.objectsTypename[__typename]);
                        if (!isErrorObject)
                            return null;
                        // todo extract message
                        return new Error(`Failure on field ${rootFieldName}: ${__typename}`);
                    }).filter((_) => _ !== null);
                    if (schemaErrors.length === 1)
                        throw schemaErrors[0];
                    if (schemaErrors.length > 0) {
                        const error = new Errors.ContextualAggregateError(`Two or more schema errors in the execution result.`, {}, schemaErrors);
                        throw error;
                    }
                }
            }
            if (context.config.returnMode === `graphqlSuccess`) {
                return result;
            }
            return result.data;
        }
        default: {
            return result;
        }
    }
};
const applyOrThrowToContext = (context) => {
    if (context.config.returnMode === `successData` || context.config.returnMode === `graphqlSuccess`) {
        return context;
    }
    const newMode = context.config.returnMode === `graphql` ? `graphqlSuccess` : `successData`;
    return updateContextConfig(context, { returnMode: newMode });
};
const updateContextConfig = (context, config) => {
    return { ...context, config: { ...context.config, ...config } };
};
//# sourceMappingURL=client.js.map