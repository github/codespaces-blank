export var Code;
(function (Code) {
    Code.propertyAccess = (object, name) => `${object}.${name}`;
    Code.quote = (str) => `"${str}"`;
    Code.nullable = (type) => `${type} | null`;
    Code.union = (name, types) => `type ${name} =\n| ${Code.unionItems(types)}`;
    Code.unionItems = (types) => types.join(`\n| `);
    Code.tuple = (types) => `[${types.join(`, `)}]`;
    Code.list = (type) => `Array<${type}>`;
    Code.field = (name, type, options) => {
        if (options?.optional)
            return `${name}?: ${type}`;
        return `${name}: ${type}`;
    };
    Code.optionalField = (name, type) => Code.field(name, type, { optional: true });
    Code.fields = (fieldTypes) => fieldTypes.join(`\n`);
    Code.intersection = (a, b) => `${a} & ${b}`;
    Code.object = (fields) => `{\n${fields}\n}`;
    Code.objectFromEntries = (entries) => Code.objectFrom(Object.fromEntries(entries.map(([name, type]) => [name, { type }])));
    Code.objectFrom = (object) => {
        return Code.object(Code.fields(Object.entries(object).map(([name, spec]) => [name, spec && typeof spec === `object` ? spec : { type: spec }])
            .map(([name, spec]) => Code.field(name, String(spec.type), { optional: spec.optional }))));
    };
    Code.type = (name, type) => `type ${name} = ${type}`;
    Code.interface$ = (name, object) => `interface ${name} ${object}`;
    Code.export$ = (thing) => `export ${thing}`;
    Code.TSDoc = (content, block) => content === null ? block : `/**\n${prependLines(`* `, content) || `*`}\n*/\n${block}`;
    Code.namespace = (name, content) => `namespace ${name} ${Code.object(content)}`;
    Code.group = (...content) => content.join(`\n`);
    Code.commentSectionTitle = (title) => {
        const lineSize = 60;
        const line = `-`.repeat(lineSize);
        const titlePrefixSpace = ` `.repeat(Math.round(lineSize / 2) - Math.round(title.length / 2));
        const titleSuffixSpace = ` `.repeat(lineSize - (titlePrefixSpace.length + title.length));
        return `\n\n// ${line} //\n// ${titlePrefixSpace + title + titleSuffixSpace} //\n// ${line} //\n\n`;
    };
})(Code || (Code = {}));
const prependLines = (prepend, str) => str.split(`\n`).map((line) => `${prepend}${line}`).join(`\n`);
//# sourceMappingURL=Code.js.map