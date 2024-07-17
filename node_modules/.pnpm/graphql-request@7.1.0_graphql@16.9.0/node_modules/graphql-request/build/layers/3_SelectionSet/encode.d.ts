import { Schema } from '../1_Schema/__.js';
import type { ReturnModeType } from '../5_client/Config.js';
import type { SelectionSet } from './__.js';
import type { Indicator } from './runtime/indicator.js';
type SpecialFields = {
    $include?: SelectionSet.Directive.Include['$include'];
    $skip?: SelectionSet.Directive.Skip['$skip'];
    $defer?: SelectionSet.Directive.Defer['$defer'];
    $stream?: SelectionSet.Directive.Stream['$stream'];
    $?: Args;
};
type Args = {
    [k: string]: ArgValue;
};
type ArgValue = string | boolean | null | number | Args;
export type DocumentObject = Record<string, GraphQLRootSelection>;
export type GraphQLRootSelection = {
    query: GraphQLObjectSelection;
} | {
    mutation: GraphQLObjectSelection;
};
export type GraphQLObjectSelection = Record<string, Indicator | SS>;
export type SS = {
    [k: string]: Indicator | SS;
} & SpecialFields;
type FieldValue = SS | Indicator;
export interface Context {
    schemaIndex: Schema.Index;
    config: {
        returnMode: ReturnModeType;
    };
}
export declare const rootTypeSelectionSet: (context: Context, objectDef: Schema.Object$2, selectionSet: GraphQLObjectSelection, operationName?: string) => string;
export declare const resolveObjectLikeFieldValue: (context: Context, schemaItem: Schema.Object$2 | Schema.Union | Schema.Interface, fieldValue: FieldValue) => string;
export declare const resolveOn: (field: string) => string;
export {};
//# sourceMappingURL=encode.d.ts.map