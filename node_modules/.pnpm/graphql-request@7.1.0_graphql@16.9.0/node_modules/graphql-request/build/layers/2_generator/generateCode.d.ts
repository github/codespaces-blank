import type { Formatter } from '@dprint/formatter';
import type { GraphQLObjectType, GraphQLSchema } from 'graphql';
import type { TypeMapByKind } from '../../lib/graphql.js';
export interface OptionsInput {
    name?: string;
    errorTypeNamePattern?: RegExp;
    /**
     * Should custom scalars definitions be imported into the generated output?
     */
    customScalars?: boolean;
    formatter?: Formatter;
    TSDoc?: {
        noDocPolicy?: 'message' | 'ignore';
    };
}
export interface Input {
    name?: string;
    libraryPaths?: {
        client?: string;
        schema?: string;
        scalars?: string;
    };
    importPaths?: {
        customScalarCodecs?: string;
    };
    /**
     * The GraphQL SDL source code.
     */
    schemaSource: string;
    options?: OptionsInput;
}
export interface Config {
    name: string;
    schema: GraphQLSchema;
    typeMapByKind: TypeMapByKind;
    rootTypes: {
        Query: GraphQLObjectType | null;
        Mutation: GraphQLObjectType | null;
        Subscription: GraphQLObjectType | null;
    };
    error: {
        objects: GraphQLObjectType[];
        enabled: boolean;
    };
    libraryPaths: {
        client: string;
        schema: string;
        scalars: string;
    };
    importPaths: {
        customScalarCodecs: string;
    };
    options: {
        errorTypeNamePattern: RegExp | null;
        customScalars: boolean;
        TSDoc: {
            noDocPolicy: 'message' | 'ignore';
        };
    };
}
export declare const defaultName = "default";
export declare const resolveOptions: (input: Input) => Config;
export declare const generateCode: (input: Input) => {
    code: string;
    moduleName: string;
}[];
//# sourceMappingURL=generateCode.d.ts.map