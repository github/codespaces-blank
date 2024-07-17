export const toGraphQLDirective = (directive) => {
    return `@${directive.name}(${toGraphQLDirectiveArgs(directive.args)})`;
};
export const toGraphQLDirectiveArgs = (args) => {
    return Object.entries(args).filter(([_, v]) => v !== undefined).map(([k, clientValue]) => {
        // todo can directives receive custom scalars?
        const value = JSON.stringify(clientValue);
        return `${k}: ${value}`;
    }).join(`, `);
};
//# sourceMappingURL=directive.js.map