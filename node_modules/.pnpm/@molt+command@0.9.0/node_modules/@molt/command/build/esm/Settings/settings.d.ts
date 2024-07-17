/// <reference types="node" resolution-mode="require"/>
/// <reference types="node" resolution-mode="require"/>
/// <reference types="node" resolution-mode="require"/>
/// <reference types="node" resolution-mode="require"/>
/// <reference types="node" resolution-mode="require"/>
import type { State } from '../Builder/State.js';
import type { EventPatternsInput, EventPatternsInputAtLeastOne } from '../eventPatterns.js';
import type { Values } from '../helpers.js';
import type { ParameterSpec } from '../ParameterSpec/index.js';
import type { FlagName } from '@molt/types';
export type OnErrorReaction = 'exit' | 'throw';
export type InputPrompt<S extends ParameterSpec.Input.Schema> = boolean | {
    enabled?: boolean;
    when?: EventPatternsInputAtLeastOne<S>;
};
export interface Input<ParametersObject extends State.ParametersSchemaObjectBase = {}> {
    description?: string;
    help?: boolean;
    helpOnNoArguments?: boolean;
    helpOnError?: boolean;
    helpRendering?: {
        union?: {
            mode?: 'expandAlways' | 'expandOnParameterDescription';
        };
    };
    onError?: OnErrorReaction;
    onOutput?: (output: string, defaultHandler: (output: string) => void) => void;
    prompt?: InputPrompt<Values<ParametersObject>>;
    parameters?: {
        environment?: boolean | ({
            [FlagSpecExpression in keyof ParametersObject as FlagName.Data.GetCanonicalNameOrErrorFromParseResult<FlagName.Parse<FlagSpecExpression & string>>]?: boolean | SettingInputEnvironmentParameter;
        } & {
            $default?: boolean | SettingInputEnvironmentParameter;
        });
    };
}
export interface Output {
    prompt: {
        enabled: boolean;
        when: EventPatternsInput<ParameterSpec.Input.Schema>;
    };
    description?: string | undefined;
    help: boolean;
    helpOnNoArguments: boolean;
    helpOnError: boolean;
    helpRendering: {
        union: {
            mode: 'expandAlways' | 'expandOnParameterDescription';
        };
    };
    onError: OnErrorReaction;
    onOutput: (output: string) => void;
    parameters: {
        environment: Record<string, SettingNormalizedEnvironmentParameter> & {
            $default: SettingNormalizedEnvironmentParameterDefault;
        };
    };
}
interface SettingNormalizedEnvironmentParameterDefault {
    enabled: boolean;
    prefix: string[];
}
export interface SettingNormalizedEnvironmentParameter {
    enabled?: boolean;
    prefix?: string[];
}
interface SettingInputEnvironmentParameter {
    enabled?: boolean;
    prefix?: boolean | string | string[];
}
interface Environment {
    cli_settings_read_arguments_from_environment?: string | undefined;
    [name: string]: string | undefined;
}
export declare const change: (current: Output, input: Input<{}>, environment: Environment) => void;
export declare const getDefaults: (lowercaseEnv: NodeJS.ProcessEnv) => Output;
export {};
//# sourceMappingURL=settings.d.ts.map