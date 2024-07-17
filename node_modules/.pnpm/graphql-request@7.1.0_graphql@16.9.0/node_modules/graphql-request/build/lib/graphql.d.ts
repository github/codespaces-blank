import type { GraphQLEnumValue, GraphQLError, GraphQLField, GraphQLInputField, GraphQLSchema } from 'graphql';
import { GraphQLEnumType, GraphQLInputObjectType, GraphQLInterfaceType, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLScalarType, GraphQLUnionType } from 'graphql';
import type { ObjMap } from 'graphql/jsutils/ObjMap.js';
import type { Errors } from './errors/__.js';
export type TypeMapByKind = {
    [Name in keyof NameToClassNamedType]: InstanceType<NameToClassNamedType[Name]>[];
} & {
    GraphQLRootType: GraphQLObjectType[];
} & {
    GraphQLScalarTypeCustom: GraphQLScalarType<any, any>[];
} & {
    GraphQLScalarTypeStandard: GraphQLScalarType<any, any>[];
};
export declare const standardScalarTypeNames: {
    String: string;
    ID: string;
    Int: string;
    Float: string;
    Boolean: string;
};
export declare const RootTypeName: {
    readonly Query: "Query";
    readonly Mutation: "Mutation";
    readonly Subscription: "Subscription";
};
export declare const operationTypeNameToRootTypeName: {
    readonly query: "Query";
    readonly mutation: "Mutation";
    readonly subscription: "Subscription";
};
export declare const rootTypeNameToOperationName: {
    readonly Query: "query";
    readonly Mutation: "mutation";
    readonly Subscription: "subscription";
};
export type RootTypeName = keyof typeof RootTypeName;
export declare const isStandardScalarType: (type: GraphQLScalarType) => boolean;
export declare const isCustomScalarType: (type: GraphQLScalarType) => boolean;
export declare const unwrapToNamed: (type: AnyClass) => AnyClass;
export declare const unwrapToNonNull: (type: AnyClass) => {
    ofType: AnyClass;
    nullable: boolean;
};
export declare const getTypeMapByKind: (schema: GraphQLSchema) => TypeMapByKind;
export type ClassToName<C> = C extends GraphQLScalarType ? `GraphQLScalarType` : C extends GraphQLObjectType ? `GraphQLObjectType` : C extends GraphQLInterfaceType ? `GraphQLInterfaceType` : C extends GraphQLUnionType ? `GraphQLUnionType` : C extends GraphQLEnumType ? `GraphQLEnumType` : C extends GraphQLInputObjectType ? `GraphQLInputObjectType` : C extends GraphQLList<any> ? `GraphQLList` : C extends GraphQLNonNull<any> ? `GraphQLNonNull` : never;
export declare const NameToClassNamedType: {
    GraphQLScalarType: typeof GraphQLScalarType;
    GraphQLObjectType: typeof GraphQLObjectType;
    GraphQLInterfaceType: typeof GraphQLInterfaceType;
    GraphQLUnionType: typeof GraphQLUnionType;
    GraphQLEnumType: typeof GraphQLEnumType;
    GraphQLInputObjectType: typeof GraphQLInputObjectType;
};
export type NameToClassNamedType = typeof NameToClassNamedType;
export declare const NamedNameToClass: {
    readonly GraphQLScalarType: typeof GraphQLScalarType;
    readonly GraphQLObjectType: typeof GraphQLObjectType;
    readonly GraphQLInterfaceType: typeof GraphQLInterfaceType;
    readonly GraphQLUnionType: typeof GraphQLUnionType;
    readonly GraphQLEnumType: typeof GraphQLEnumType;
    readonly GraphQLInputObjectType: typeof GraphQLInputObjectType;
};
export type NamedNameToClass = typeof NamedNameToClass;
export declare const NameToClass: {
    readonly GraphQLScalarType: typeof GraphQLScalarType;
    readonly GraphQLObjectType: typeof GraphQLObjectType;
    readonly GraphQLInterfaceType: typeof GraphQLInterfaceType;
    readonly GraphQLUnionType: typeof GraphQLUnionType;
    readonly GraphQLEnumType: typeof GraphQLEnumType;
    readonly GraphQLInputObjectType: typeof GraphQLInputObjectType;
    readonly GraphQLNonNull: typeof GraphQLNonNull;
    readonly GraphQLList: typeof GraphQLList;
};
export type AnyGraphQLOutputField = GraphQLField<any, any>;
export type AnyField = AnyGraphQLOutputField | GraphQLInputField;
export type NameToClass = typeof NameToClass;
export type NodeName = keyof NameToClass;
export type NodeNamePlus = NodeName | 'GraphQLField';
export type AnyNamedClassName = keyof NamedNameToClass;
export type AnyClass = InstanceType<NameToClass[keyof NameToClass]>;
export declare const isGraphQLOutputField: (object: object) => object is AnyGraphQLOutputField;
/**
 * Groups
 */
export type Describable = GraphQLUnionType | GraphQLObjectType | GraphQLInputObjectType | AnyField | GraphQLInterfaceType | GraphQLEnumType;
export declare const getNodeName: (node: Describable) => NodeNamePlus;
export declare const getNodeDisplayName: (node: Describable) => string;
export declare const isDeprecatableNode: (node: object) => node is GraphQLEnumValue | AnyField;
export declare const hasQuery: (typeMapByKind: TypeMapByKind) => GraphQLObjectType<any, any> | undefined;
export declare const hasMutation: (typeMapByKind: TypeMapByKind) => GraphQLObjectType<any, any> | undefined;
export declare const hasSubscription: (typeMapByKind: TypeMapByKind) => GraphQLObjectType<any, any> | undefined;
export type StandardScalarVariables = {
    [key: string]: string | boolean | null | number | StandardScalarVariables;
};
export type GraphQLExecutionResultError = Errors.ContextualAggregateError<GraphQLError>;
export type OperationTypeName = 'query' | 'mutation';
export declare const isOperationTypeName: (value: unknown) => value is OperationTypeName;
export interface SomeExecutionResultWithoutErrors<TData = ObjMap<unknown>, TExtensions = ObjMap<unknown>> {
    errors?: readonly [];
    data?: TData | null;
    extensions?: TExtensions;
}
//# sourceMappingURL=graphql.d.ts.map