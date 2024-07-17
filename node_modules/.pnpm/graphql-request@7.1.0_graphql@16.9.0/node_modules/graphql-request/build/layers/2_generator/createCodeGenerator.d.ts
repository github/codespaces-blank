import type { Config } from './generateCode.js';
export type CodeGeneratorImplementation = (config: Config) => CodeGeneratorImplementationResult;
type CodeGeneratorImplementationResult = string;
interface CodeGeneratorResult {
    moduleName: string;
    code: string;
}
export type CodeGenerator = (config: Config) => CodeGeneratorResult;
export type CodeGeneratorConstructor = (moduleName: string, codeGenerator: CodeGeneratorImplementation) => {
    moduleName: string;
    generate: CodeGenerator;
};
export declare const createCodeGenerator: CodeGeneratorConstructor;
export {};
//# sourceMappingURL=createCodeGenerator.d.ts.map