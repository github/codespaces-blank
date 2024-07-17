export interface FieldName {
    _tag: 'FieldName';
    actual: string;
    alias: string | null;
}
export declare const parseClientFieldName: (field: string) => FieldName;
export declare const toGraphQLFieldName: (fieldName: FieldName) => string;
/**
 * @see https://regex101.com/r/XfOTMX/1
 * @see http://spec.graphql.org/draft/#sec-Names
 */
export declare const aliasPattern: RegExp;
//# sourceMappingURL=FieldName.d.ts.map