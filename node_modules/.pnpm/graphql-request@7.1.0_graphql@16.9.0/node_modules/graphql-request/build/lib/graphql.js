import { GraphQLEnumType, GraphQLInputObjectType, GraphQLInterfaceType, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLScalarType, GraphQLUnionType, isListType, isNonNullType, } from 'graphql';
export const standardScalarTypeNames = {
    String: `String`,
    ID: `ID`,
    Int: `Int`,
    Float: `Float`,
    Boolean: `Boolean`,
};
export const RootTypeName = {
    Query: `Query`,
    Mutation: `Mutation`,
    Subscription: `Subscription`,
};
export const operationTypeNameToRootTypeName = {
    query: `Query`,
    mutation: `Mutation`,
    subscription: `Subscription`,
};
export const rootTypeNameToOperationName = {
    Query: `query`,
    Mutation: `mutation`,
    Subscription: `subscription`,
};
export const isStandardScalarType = (type) => {
    return type.name in standardScalarTypeNames;
};
export const isCustomScalarType = (type) => {
    return !isStandardScalarType(type);
};
export const unwrapToNamed = (type) => {
    if (isNonNullType(type))
        return unwrapToNamed(unwrapToNonNull(type).ofType);
    if (isListType(type))
        return unwrapToNamed(type.ofType);
    return type;
};
export const unwrapToNonNull = (type) => {
    const [nodeUnwrapped, nullable] = type instanceof GraphQLNonNull ? [type.ofType, false] : [type, true];
    return { ofType: nodeUnwrapped, nullable };
};
export const getTypeMapByKind = (schema) => {
    const typeMap = schema.getTypeMap();
    const typeMapValues = Object.values(typeMap);
    const typeMapByKind = {
        GraphQLRootType: [],
        GraphQLScalarType: [],
        GraphQLScalarTypeCustom: [],
        GraphQLScalarTypeStandard: [],
        GraphQLEnumType: [],
        GraphQLInputObjectType: [],
        GraphQLInterfaceType: [],
        GraphQLObjectType: [],
        GraphQLUnionType: [],
    };
    for (const type of typeMapValues) {
        if (type.name.startsWith(`__`))
            continue;
        switch (true) {
            case type instanceof GraphQLScalarType:
                typeMapByKind.GraphQLScalarType.push(type);
                if (isCustomScalarType(type)) {
                    typeMapByKind.GraphQLScalarTypeCustom.push(type);
                }
                else {
                    typeMapByKind.GraphQLScalarTypeStandard.push(type);
                }
                break;
            case type instanceof GraphQLEnumType:
                typeMapByKind.GraphQLEnumType.push(type);
                break;
            case type instanceof GraphQLInputObjectType:
                typeMapByKind.GraphQLInputObjectType.push(type);
                break;
            case type instanceof GraphQLInterfaceType:
                typeMapByKind.GraphQLInterfaceType.push(type);
                break;
            case type instanceof GraphQLObjectType:
                if (type.name === `Query` || type.name === `Mutation` || type.name === `Subscription`) {
                    typeMapByKind.GraphQLRootType.push(type);
                }
                else {
                    typeMapByKind.GraphQLObjectType.push(type);
                }
                break;
            case type instanceof GraphQLUnionType:
                typeMapByKind.GraphQLUnionType.push(type);
                break;
            default:
                // skip
                break;
        }
    }
    return typeMapByKind;
};
export const NameToClassNamedType = {
    GraphQLScalarType: GraphQLScalarType,
    GraphQLObjectType: GraphQLObjectType,
    GraphQLInterfaceType: GraphQLInterfaceType,
    GraphQLUnionType: GraphQLUnionType,
    GraphQLEnumType: GraphQLEnumType,
    GraphQLInputObjectType: GraphQLInputObjectType,
};
export const NamedNameToClass = {
    GraphQLScalarType: GraphQLScalarType,
    GraphQLObjectType: GraphQLObjectType,
    GraphQLInterfaceType: GraphQLInterfaceType,
    GraphQLUnionType: GraphQLUnionType,
    GraphQLEnumType: GraphQLEnumType,
    GraphQLInputObjectType: GraphQLInputObjectType,
};
export const NameToClass = {
    GraphQLNonNull: GraphQLNonNull,
    GraphQLList: GraphQLList,
    ...NamedNameToClass,
};
export const isGraphQLOutputField = (object) => {
    return `args` in object;
};
export const getNodeName = (node) => {
    switch (true) {
        case node instanceof GraphQLObjectType:
            return `GraphQLObjectType`;
        case node instanceof GraphQLInputObjectType:
            return `GraphQLInputObjectType`;
        case node instanceof GraphQLUnionType:
            return `GraphQLUnionType`;
        case node instanceof GraphQLInterfaceType:
            return `GraphQLInterfaceType`;
        case node instanceof GraphQLEnumType:
            return `GraphQLEnumType`;
        case node instanceof GraphQLScalarType:
            return `GraphQLScalarType`;
        default:
            return `GraphQLField`;
    }
};
// const displayNames = {
//   GraphQLEnumType: `Enum`,
//   GraphQLInputObjectType: `InputObject`,
//   GraphQLInterfaceType: `Interface`,
//   GraphQLList: `List`,
//   GraphQLNonNull: `NonNull`,
//   GraphQLObjectType: `Object`,
//   GraphQLScalarType: `Scalar`,
//   GraphQLUnionType: `Union`,
// } satisfies Record<NodeName, string>
export const getNodeDisplayName = (node) => {
    return toDisplayName(getNodeName(node));
};
const toDisplayName = (nodeName) => {
    return nodeName.replace(/^GraphQL/, ``).replace(/Type$/, ``);
};
export const isDeprecatableNode = (node) => {
    return `deprecationReason` in node;
};
export const hasQuery = (typeMapByKind) => typeMapByKind.GraphQLRootType.find((_) => _.name === `Query`);
export const hasMutation = (typeMapByKind) => typeMapByKind.GraphQLRootType.find((_) => _.name === `Mutation`);
export const hasSubscription = (typeMapByKind) => typeMapByKind.GraphQLRootType.find((_) => _.name === `Subscription`);
export const isOperationTypeName = (value) => value === `query` || value === `mutation`;
//# sourceMappingURL=graphql.js.map