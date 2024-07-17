export const create = () => {
    const _ = {
        input: {
            _tag: `Exclusive`,
            optionality: { _tag: `required` },
            parameters: [],
        },
        typeState: undefined, // eslint-disable-line
    };
    const chain = {
        parameter: (nameExpression, schemaOrConfiguration) => {
            const configuration = `schema` in schemaOrConfiguration ? schemaOrConfiguration : { schema: schemaOrConfiguration };
            _.input.parameters.push({ nameExpression, type: configuration.schema });
            return chain; // eslint-disable-line
        },
        optional: () => {
            _.input.optionality = { _tag: `optional` };
            return chain;
        },
        default: (tag, value) => {
            _.input.optionality = { _tag: `default`, tag, value };
            return chain;
        },
        _,
    };
    return chain;
};
//# sourceMappingURL=constructor.js.map