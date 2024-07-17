export declare const onPattern: RegExp;
export interface On {
    _tag: 'On';
    typeOrFragmentName: string;
}
export declare const parseClientOn: (field: string) => null | On;
export declare const toGraphQLOn: (on: On) => string;
//# sourceMappingURL=on.d.ts.map