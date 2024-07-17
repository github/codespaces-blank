import type { RawArgInputs } from '../Builder/root/types.js';
import type { Settings } from '../index.js';
import { OpeningArgs } from '../OpeningArgs/index.js';
import { ParameterSpec } from '../ParameterSpec/index.js';
export interface ParseProgressPostPromptAnnotation {
    globalErrors: OpeningArgs.ParseResult['globalErrors'];
    mutuallyExclusiveParameters: OpeningArgs.ParseResult['mutuallyExclusiveParameters'];
    basicParameters: Record<string, {
        openingParseResult: OpeningArgs.ParseResult['basicParameters'][string];
        spec: OpeningArgs.ParseResult['basicParameters'][string]['spec'];
        prompt: {
            enabled: boolean;
        };
    }>;
}
export interface ParseProgressPostPrompt {
    globalErrors: OpeningArgs.ParseResult['globalErrors'];
    mutuallyExclusiveParameters: OpeningArgs.ParseResult['mutuallyExclusiveParameters'];
    basicParameters: Record<string, {
        spec: OpeningArgs.ParseResult['basicParameters'][string]['spec'];
        openingParseResult: OpeningArgs.ParseResult['basicParameters'][string];
        prompt: {
            enabled: boolean;
            arg: ParameterSpec.ArgumentValue;
        };
    }>;
}
export interface ParseProgressDone {
    globalErrors: OpeningArgs.ParseResult['globalErrors'];
    mutuallyExclusiveParameters: OpeningArgs.ParseResult['mutuallyExclusiveParameters'];
    basicParameters: Record<string, {
        spec: OpeningArgs.ParseResult['basicParameters'][string]['spec'];
        openingParseResult: OpeningArgs.ParseResult['basicParameters'][string];
        prompt: {
            enabled: boolean;
            arg: any;
        };
        arg: any;
    }>;
}
export declare const parse: (settings: Settings.Output, parameterSpecInputs: Record<string, ParameterSpec.Input>, argInputs: RawArgInputs) => {
    [x: string]: ParameterSpec.ArgumentValue;
} | Promise<{
    [x: string]: ParameterSpec.ArgumentValue;
}>;
//# sourceMappingURL=parse.d.ts.map