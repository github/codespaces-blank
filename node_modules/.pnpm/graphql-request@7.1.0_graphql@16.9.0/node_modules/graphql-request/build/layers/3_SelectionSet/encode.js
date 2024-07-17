import { RootTypeName } from '../../lib/graphql.js';
import { assertArray, assertObject, lowerCaseFirstLetter } from '../../lib/prelude.js';
import { Schema } from '../1_Schema/__.js';
import { readMaybeThunk } from '../1_Schema/core/helpers.js';
import { isSelectFieldName } from './helpers.js';
import { parseClientDirectiveDefer } from './runtime/directives/defer.js';
import { toGraphQLDirective } from './runtime/directives/directive.js';
import { parseClientDirectiveInclude } from './runtime/directives/include.js';
import { parseClientDirectiveSkip } from './runtime/directives/skip.js';
import { parseClientDirectiveStream } from './runtime/directives/stream.js';
import { parseClientFieldItem } from './runtime/FieldItem.js';
import { parseClientFieldName, toGraphQLFieldName } from './runtime/FieldName.js';
import { isIndicator, isPositiveIndicator } from './runtime/indicator.js';
import { parseClientOn, toGraphQLOn } from './runtime/on.js';
export const rootTypeSelectionSet = (context, objectDef, selectionSet, operationName = ``) => {
    const operationTypeName = lowerCaseFirstLetter(objectDef.fields.__typename.type.type);
    return `${operationTypeName} ${operationName} { ${resolveObjectLikeFieldValue(context, objectDef, selectionSet)} }`;
};
const resolveDirectives = (fieldValue) => {
    if (isIndicator(fieldValue))
        return ``;
    const { $include, $skip, $defer, $stream } = fieldValue;
    let directives = ``;
    if ($stream !== undefined) {
        directives += toGraphQLDirective(parseClientDirectiveStream($stream));
    }
    if ($defer !== undefined) {
        directives += toGraphQLDirective(parseClientDirectiveDefer($defer));
    }
    if ($include !== undefined) {
        directives += toGraphQLDirective(parseClientDirectiveInclude($include));
    }
    if ($skip !== undefined) {
        directives += toGraphQLDirective(parseClientDirectiveSkip($skip));
    }
    return directives;
};
const resolveArgValue = (context, schemaArgTypeMaybeThunk, argValue) => {
    if (argValue === null)
        return String(null); // todo could check if index agrees is nullable.
    const schemaArgType = readMaybeThunk(schemaArgTypeMaybeThunk);
    switch (schemaArgType.kind) {
        case `nullable`:
            return resolveArgValue(context, schemaArgType.type, argValue);
        case `list`: {
            assertArray(argValue);
            const value = argValue.map(_ => resolveArgValue(context, schemaArgType.type, _));
            return `[${value.join(`, `)}]`;
        }
        case `InputObject`: {
            assertObject(argValue);
            const entries = Object.entries(argValue).map(([argName, argValue]) => {
                const schemaArgField = schemaArgType.fields[argName];
                if (!schemaArgField)
                    throw new Error(`Arg not found: ${argName}`);
                return [argName, resolveArgValue(context, schemaArgField.type, argValue)];
            });
            return `{ ${entries.map(([k, v]) => `${k}: ${v}`).join(`, `)} }`;
        }
        case `Enum`: {
            return String(argValue);
        }
        case `Scalar`: {
            // @ts-expect-error fixme
            return JSON.stringify(schemaArgType.codec.encode(argValue));
        }
        default:
            throw new Error(`Unsupported arg kind: ${JSON.stringify(schemaArgType)}`);
    }
};
const resolveArgs = (context, schemaField, ss) => {
    if (isIndicator(ss))
        return ``;
    const { $ } = ss;
    if ($ === undefined)
        return ``;
    const schemaArgs = schemaField.args;
    if (!schemaArgs)
        throw new Error(`Field has no args`);
    const argEntries = Object.entries($);
    if (argEntries.length === 0)
        return ``;
    return `(${argEntries.map(([argFieldName, v]) => {
        const schemaArgField = schemaArgs.fields[argFieldName]; // eslint-disable-line
        if (!schemaArgField)
            throw new Error(`Arg field ${argFieldName} not found in schema.`);
        const valueEncoded = resolveArgValue(context, schemaArgField, v);
        return `${argFieldName}: ${valueEncoded}`;
    }).join(`, `)})`;
};
const pruneNonSelections = (ss) => {
    const entries = Object.entries(ss);
    const selectEntries = entries.filter(_ => !_[0].startsWith(`$`));
    return Object.fromEntries(selectEntries);
};
const resolveFieldValue = (context, schemaField, fieldValue) => {
    if (fieldValue === null)
        return `null`; // todo test this case
    if (isIndicator(fieldValue))
        return ``;
    const entries = Object.entries(fieldValue);
    const directives = resolveDirectives(fieldValue);
    const args = resolveArgs(context, schemaField, fieldValue);
    const selects = entries.filter(_ => isSelectFieldName(_[0]));
    if (selects.length === 0) {
        return `${args} ${directives}`;
    }
    const selection = Object.fromEntries(selects);
    // eslint-disable-next-line
    // @ts-ignore ID error
    const schemaNamedOutputType = Schema.Output.unwrapToNamed(schemaField.type);
    return `${args} ${directives} {
		${resolveObjectLikeFieldValue(context, readMaybeThunk(schemaNamedOutputType), selection)}
	}`;
};
export const resolveObjectLikeFieldValue = (context, schemaItem, fieldValue) => {
    // todo optimize by doing single loop
    const applicableSelections = Object.entries(fieldValue).filter(([_, ss]) => isPositiveIndicator(ss));
    switch (schemaItem.kind) {
        case `Object`: {
            const rootTypeName = RootTypeName[schemaItem.fields.__typename.type.type]
                ?? null;
            return applicableSelections.map(([clientFieldName, ss]) => {
                const fieldName = parseClientFieldName(clientFieldName);
                const schemaField = schemaItem.fields[fieldName.actual];
                if (!schemaField)
                    throw new Error(`Field ${clientFieldName} not found in schema object`);
                /**
                 * Inject __typename field for result fields that are missing it.
                 */
                // dprint-ignore
                if (rootTypeName && context.config.returnMode === `successData` && context.schemaIndex.error.rootResultFields[rootTypeName][fieldName.actual]) {
                    ss[`__typename`] = true;
                }
                return `${toGraphQLFieldName(fieldName)} ${resolveFieldValue(context, schemaField, ss)}`;
            }).join(`\n`) + `\n`;
        }
        case `Interface`: {
            return applicableSelections.map(([ClientFieldName, ss]) => {
                const fieldItem = parseClientFieldItem(ClientFieldName);
                switch (fieldItem._tag) {
                    case `FieldName`: {
                        if (fieldItem.actual === `__typename`) {
                            return `${toGraphQLFieldName(fieldItem)} ${resolveDirectives(ss)}`;
                        }
                        const schemaField = schemaItem.fields[fieldItem.actual];
                        if (!schemaField)
                            throw new Error(`Field ${ClientFieldName} not found in schema object`);
                        return `${toGraphQLFieldName(fieldItem)} ${resolveFieldValue(context, schemaField, ss)}`;
                    }
                    case `On`: {
                        const schemaObject = context.schemaIndex[`objects`][fieldItem.typeOrFragmentName];
                        if (!schemaObject)
                            throw new Error(`Fragment ${fieldItem.typeOrFragmentName} not found in schema`);
                        return `${toGraphQLOn(fieldItem)} ${resolveDirectives(ss)} { ${resolveObjectLikeFieldValue(context, schemaObject, ss)} }`;
                    }
                    default: {
                        throw new Error(`Unknown field item tag`);
                    }
                }
            }).join(`\n`) + `\n`;
        }
        case `Union`: {
            return applicableSelections.map(([fieldExpression, ss]) => {
                const fieldItem = parseClientFieldItem(fieldExpression);
                switch (fieldItem._tag) {
                    case `FieldName`: {
                        if (fieldItem.actual === `__typename`) {
                            return `${toGraphQLFieldName(fieldItem)} ${resolveDirectives(ss)}`;
                        }
                        // todo
                        throw new Error(`todo resolve common interface fields from unions`);
                    }
                    case `On`: {
                        const schemaObject = context.schemaIndex[`objects`][fieldItem.typeOrFragmentName];
                        if (!schemaObject)
                            throw new Error(`Fragment ${fieldItem.typeOrFragmentName} not found in schema`);
                        // if (isIndicator(ss)) throw new Error(`Union field must have selection set`)
                        return `${toGraphQLOn(fieldItem)} ${resolveDirectives(ss)} { ${
                        // @ts-expect-error fixme
                        resolveObjectLikeFieldValue(context, schemaObject, pruneNonSelections(ss))} }`;
                    }
                    default: {
                        throw new Error(`Unknown field item tag`);
                    }
                }
            }).join(`\n`) + `\n`;
        }
        default:
            throw new Error(`Unknown schema item kind`);
    }
};
export const resolveOn = (field) => {
    const on = parseClientOn(field);
    if (on)
        return toGraphQLOn(on);
    return field;
};
//# sourceMappingURL=encode.js.map