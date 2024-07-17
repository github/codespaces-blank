import type { OptionsInput } from './generateCode.js';
import { type Input as GenerateInput } from './generateCode.js';
export interface Input {
    name?: string;
    outputDirPath: string;
    code?: Omit<GenerateInput, 'schemaSource' | 'sourceDirPath' | 'options'>;
    sourceDirPath?: string;
    sourceCustomScalarCodecsFilePath?: string;
    schemaPath?: string;
    format?: boolean;
    errorTypeNamePattern?: OptionsInput['errorTypeNamePattern'];
}
export declare const generateFiles: (input: Input) => Promise<void>;
//# sourceMappingURL=files.d.ts.map