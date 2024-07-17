import { standardScalarTypeNames } from '../../lib/graphql.js';
import { assertArray, mapValues } from '../../lib/prelude.js';
import { Output } from '../1_Schema/__.js';
import { readMaybeThunk } from '../1_Schema/core/helpers.js';
import { assertGraphQLObject } from '../4_ResultSet/runtime.js';
export const decode = (index, data) => {
    if (!data)
        return data;
    return mapValues(data, (v, fieldName) => {
        const indexField = index.fields[fieldName];
        if (!indexField)
            throw new Error(`Field not found: ${String(fieldName)}`);
        const type = readMaybeThunk(indexField.type);
        const typeWithoutNonNull = Output.unwrapNullable(type);
        const v2 = decodeCustomScalarValue(typeWithoutNonNull, v);
        return v2;
    });
};
const decodeCustomScalarValue = (indexType, fieldValue) => {
    if (fieldValue === null)
        return null;
    const indexTypeDethunked = readMaybeThunk(indexType);
    const typeWithoutNonNull = Output.unwrapNullable(indexTypeDethunked);
    if (typeWithoutNonNull.kind === `list`) {
        assertArray(fieldValue);
        return fieldValue.map((v2) => {
            return decodeCustomScalarValue(typeWithoutNonNull.type, v2);
        });
    }
    if (typeWithoutNonNull.kind === `Scalar`) {
        if ((typeWithoutNonNull.name in standardScalarTypeNames)) {
            // todo test this case
            return fieldValue;
        }
        if (typeof fieldValue === `object`)
            throw new Error(`Expected scalar. Got: ${String(fieldValue)}`);
        // @ts-expect-error fixme
        return typeWithoutNonNull.codec.decode(fieldValue);
    }
    if (typeWithoutNonNull.kind === `typename`) {
        return fieldValue;
    }
    assertGraphQLObject(fieldValue);
    if (typeWithoutNonNull.kind === `Object`) {
        return decode(typeWithoutNonNull, fieldValue);
    }
    if (typeWithoutNonNull.kind === `Interface` || typeWithoutNonNull.kind === `Union`) {
        const possibleObjects = typeWithoutNonNull.kind === `Interface`
            ? typeWithoutNonNull.implementors
            : typeWithoutNonNull.members;
        // todo handle aliases -- will require having the selection set available for reference too :/
        // eslint-disable-next-line
        // @ts-ignore infinite depth issue
        // eslint-disable-next-line
        const ObjectType = possibleObjects.find((ObjectType) => {
            if (fieldValue.__typename === ObjectType.fields.__typename.type.type)
                return true;
            if (Object.keys(fieldValue).every(fieldName => ObjectType.fields[fieldName] !== undefined))
                return true;
            return false;
        });
        if (!ObjectType)
            throw new Error(`Could not pick object for ${typeWithoutNonNull.kind} selection`);
        return decode(ObjectType, fieldValue);
    }
    return fieldValue;
};
//# sourceMappingURL=customScalars.js.map