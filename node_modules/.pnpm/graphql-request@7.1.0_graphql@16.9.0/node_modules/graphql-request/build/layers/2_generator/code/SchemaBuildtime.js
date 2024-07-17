import { isEnumType, isListType, isNamedType } from 'graphql';
import { Code } from '../../../lib/Code.js';
import { getNodeDisplayName, isDeprecatableNode, isGraphQLOutputField, unwrapToNonNull, } from '../../../lib/graphql.js';
import { entries, values } from '../../../lib/prelude.js';
import { createCodeGenerator } from '../createCodeGenerator.js';
const namespaceNames = {
    GraphQLEnumType: `Enum`,
    GraphQLInputObjectType: `InputObject`,
    GraphQLInterfaceType: `Interface`,
    GraphQLObjectType: `Object`,
    GraphQLScalarType: `Scalar`,
    GraphQLUnionType: `Union`,
};
const defineReferenceRenderers = (renderers) => renderers;
const defineConcreteRenderers = (renderers) => {
    return Object.fromEntries(Object.entries(renderers).map(([key, renderer]) => {
        return [
            key,
            (config, node) => {
                if (!node)
                    return ``;
                return renderer(config, node); // eslint-disable-line
            },
        ];
    }));
};
const dispatchToReferenceRenderer = (config, node) => 
// @ts-expect-error fixme
getReferenceRenderer(node)(config, node);
// @ts-expect-error fixme
const getReferenceRenderer = (node) => {
    // @ts-expect-error lookup
    const renderer = referenceRenderers[node.constructor.name]; // eslint-disable-line
    if (!renderer) {
        throw new Error(`No renderer found for class: ${node.constructor.name}`);
    }
    return renderer;
};
const referenceRenderers = defineReferenceRenderers({
    GraphQLEnumType: (_, node) => Code.propertyAccess(namespaceNames.GraphQLEnumType, node.name),
    GraphQLInputObjectType: (_, node) => Code.propertyAccess(namespaceNames.GraphQLInputObjectType, node.name),
    GraphQLInterfaceType: (_, node) => Code.propertyAccess(namespaceNames.GraphQLInterfaceType, node.name),
    GraphQLObjectType: (_, node) => Code.propertyAccess(namespaceNames.GraphQLObjectType, node.name),
    GraphQLUnionType: (_, node) => Code.propertyAccess(namespaceNames.GraphQLUnionType, node.name),
    GraphQLScalarType: (_, node) => `$Scalar.${node.name}`,
});
const dispatchToConcreteRenderer = (config, node) => {
    // @ts-expect-error lookup
    const renderer = concreteRenderers[node.constructor.name]; // eslint-disable-line
    if (!renderer) {
        throw new Error(`No renderer found for class: ${node.constructor.name}`);
    }
    return renderer(config, node); // eslint-disable-line
};
const concreteRenderers = defineConcreteRenderers({
    GraphQLEnumType: (config, node) => Code.TSDoc(getDocumentation(config, node), Code.export$(Code.type(node.name, `$.Enum<${Code.quote(node.name)}, ${Code.tuple(node.getValues().map((_) => Code.quote(_.name)))} >`))),
    GraphQLInputObjectType: (config, node) => Code.TSDoc(getDocumentation(config, node), Code.export$(Code.type(node.name, `$.InputObject<${Code.quote(node.name)}, ${renderInputFields(config, node)}>`))),
    GraphQLInterfaceType: (config, node) => {
        const implementors = config.typeMapByKind.GraphQLObjectType.filter(_ => _.getInterfaces().filter(_ => _.name === node.name).length > 0);
        return Code.TSDoc(getDocumentation(config, node), Code.export$(Code.type(node.name, `$.Interface<${Code.quote(node.name)}, ${renderOutputFields(config, node)}, ${Code.tuple(implementors.map(_ => `Object.${_.name}`))}>`)));
    },
    GraphQLObjectType: (config, node) => Code.TSDoc(getDocumentation(config, node), Code.export$(Code.type(node.name, `$.Object$2<${Code.quote(node.name)}, ${renderOutputFields(config, node)}>`))),
    GraphQLScalarType: () => ``,
    GraphQLUnionType: (config, node) => Code.TSDoc(getDocumentation(config, node), Code.export$(Code.type(node.name, `$.Union<${Code.quote(node.name)},${Code.tuple(node
        .getTypes()
        .map((_) => dispatchToReferenceRenderer(config, _)))}>`))),
});
const getDocumentation = (config, node) => {
    const generalDescription = node.description
        ?? (config.options.TSDoc.noDocPolicy === `message` ? defaultDescription(node) : null);
    const deprecationDescription = isDeprecatableNode(node) && node.deprecationReason
        ? `@deprecated ${node.deprecationReason}`
        : null;
    const enumMemberDescriptions = isEnumType(node)
        ? node
            .getValues()
            .map((_) => {
            const deprecationDescription = _.deprecationReason
                ? `(DEPRECATED: ${_.deprecationReason})`
                : null;
            const generalDescription = _.description
                ? _.description
                : config.options.TSDoc.noDocPolicy === `message`
                    ? `Missing description.`
                    : null;
            if (!generalDescription && !deprecationDescription)
                return null;
            const content = [generalDescription, deprecationDescription]
                .filter((_) => _ !== null)
                .join(` `);
            return [_, content];
        })
            .filter((_) => _ !== null)
            .map(([node, description]) => {
            const content = `"${node.name}" - ${description}`;
            return content;
        })
        : [];
    const enumMemberDescription = enumMemberDescriptions.length > 0
        ? `Members\n${enumMemberDescriptions.join(`\n`)}`
        : null;
    if (!enumMemberDescription && !generalDescription && !deprecationDescription) {
        return null;
    }
    const content = [
        generalDescription,
        enumMemberDescription,
        deprecationDescription,
    ]
        .filter((_) => _ !== null)
        .join(`\n\n`);
    return content;
};
const defaultDescription = (node) => `There is no documentation for this ${getNodeDisplayName(node)}.`;
const renderOutputFields = (config, node) => {
    return Code.object(Code.fields([
        ...values(node.getFields()).map((field) => Code.TSDoc(getDocumentation(config, field), Code.field(field.name, renderOutputField(config, field)))),
    ]));
};
const renderInputFields = (config, node) => {
    return Code.object(Code.fields([
        ...values(node.getFields()).map((field) => Code.TSDoc(getDocumentation(config, field), Code.field(field.name, renderInputField(config, field)))),
    ]));
};
const renderOutputField = (config, field) => {
    const type = buildType(`output`, config, field.type);
    const args = isGraphQLOutputField(field) && field.args.length > 0
        ? renderArgs(config, field.args)
        : null;
    return `$.Field<${type}${args ? `, ${args}` : `, null`}>`;
};
const renderInputField = (config, field) => {
    return buildType(`input`, config, field.type);
};
const buildType = (direction, config, node) => {
    const ns = direction === `input` ? `Input` : `Output`;
    const { ofType: nodeInner, nullable } = unwrapToNonNull(node);
    if (isNamedType(nodeInner)) {
        const namedTypeReference = dispatchToReferenceRenderer(config, nodeInner);
        // const namedTypeCode = `_.Named<${namedTypeReference}>`
        const namedTypeCode = namedTypeReference;
        return nullable
            ? `$.${ns}.Nullable<${namedTypeCode}>`
            : namedTypeCode;
    }
    if (isListType(nodeInner)) {
        const fieldType = `$.${ns}.List<${buildType(direction, config, nodeInner.ofType)}>`;
        return nullable
            ? `$.${ns}.Nullable<${fieldType}>`
            : fieldType;
    }
    throw new Error(`Unhandled type: ${String(node)}`);
};
const renderArgs = (config, args) => {
    let hasRequiredArgs = false;
    const argsRendered = `$.Args<${Code.object(Code.fields(args.map((arg) => {
        const { nullable } = unwrapToNonNull(arg.type);
        hasRequiredArgs = hasRequiredArgs || !nullable;
        return Code.field(arg.name, buildType(`input`, config, arg.type));
    })))}>`;
    return argsRendered;
};
// high level
export const { generate: generateSchemaBuildtime, moduleName: moduleNameSchemaBuildtime } = createCodeGenerator(`SchemaBuildtime`, (config) => {
    let code = ``;
    code += `import type * as $ from '${config.libraryPaths.schema}'\n`;
    code += `import type * as $Scalar from './Scalar.ts'\n`;
    code += `\n\n`;
    for (const [name, types] of entries(config.typeMapByKind)) {
        if (name === `GraphQLScalarType`)
            continue;
        if (name === `GraphQLScalarTypeCustom`)
            continue;
        if (name === `GraphQLScalarTypeStandard`)
            continue;
        const namespaceName = name === `GraphQLRootType` ? `Root` : namespaceNames[name];
        code += Code.commentSectionTitle(namespaceName);
        code += Code.export$(Code.namespace(namespaceName, types.length === 0
            ? `// -- no types --\n`
            : types
                .map((_) => dispatchToConcreteRenderer(config, _))
                .join(`\n\n`)));
    }
    return code;
});
//# sourceMappingURL=SchemaBuildtime.js.map