export const onPattern = /^on(?<name>[A-Z][A-z_0-9]*)$/;
// todo use a given schema to ensure that field is actually a fragment and not just happened to be using pattern onX
export const parseClientOn = (field) => {
    const match = field.match(onPattern);
    if (match?.groups) {
        return {
            _tag: `On`,
            typeOrFragmentName: match.groups[`name`],
        };
    }
    return null;
};
export const toGraphQLOn = (on) => {
    return `...on ${on.typeOrFragmentName}`;
};
//# sourceMappingURL=on.js.map