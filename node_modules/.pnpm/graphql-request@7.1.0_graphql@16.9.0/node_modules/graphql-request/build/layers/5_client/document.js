import { operationTypeNameToRootTypeName } from '../../lib/graphql.js';
import { SelectionSet } from '../3_SelectionSet/__.js';
export const toDocumentString = (context, document) => {
    return Object.entries(document).map(([operationName, operationDocument]) => {
        const operationType = `query` in operationDocument ? `query` : `mutation`;
        const rootType = operationTypeNameToRootTypeName[operationType];
        const rootTypeDocument = operationDocument[operationType]; // eslint-disable-line
        const schemaRootType = context.schemaIndex[`Root`][rootType];
        if (!schemaRootType)
            throw new Error(`Schema has no ${rootType} root type`);
        const documentString = SelectionSet.Print.rootTypeSelectionSet(context, schemaRootType, rootTypeDocument, operationName);
        return documentString;
    }).join(`\n\n`);
};
//# sourceMappingURL=document.js.map