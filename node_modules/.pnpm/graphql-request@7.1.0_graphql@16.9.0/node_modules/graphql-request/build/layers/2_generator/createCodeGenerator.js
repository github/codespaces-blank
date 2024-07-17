export const createCodeGenerator = (moduleName, codeGeneratorImplementation) => {
    const generate = (config) => {
        const code = codeGeneratorImplementation(config);
        return {
            code,
            moduleName,
        };
    };
    return { moduleName, generate };
};
//# sourceMappingURL=createCodeGenerator.js.map