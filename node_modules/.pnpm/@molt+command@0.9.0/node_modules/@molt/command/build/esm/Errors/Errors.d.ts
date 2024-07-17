import type { OpeningArgs } from '../OpeningArgs/index.js';
import type { ParameterSpec } from '../ParameterSpec/index.js';
export declare namespace Global {
    class ErrorUnknownParameterViaEnvironment extends Error {
        name: 'ErrorUnknownParameterViaEnvironment';
        prefix: null | string;
        constructor(params: {
            flagName: string;
            prefix: null | string;
        });
    }
    class ErrorUnknownFlag extends Error {
        name: 'ErrorUnknownFlag';
        constructor(params: {
            flagName: string;
        });
    }
}
export declare class ErrorDuplicateLineArg extends Error {
    name: 'ErrorDuplicateFlag';
    spec: ParameterSpec.Output;
    constructor(params: {
        spec: ParameterSpec.Output;
        flagName: string;
    });
}
export declare class ErrorDuplicateEnvArg extends Error {
    name: 'ErrorDuplicateEnvArg';
    spec: ParameterSpec.Output;
    instances: {
        value: string;
        name: string;
        prefix: string | null;
    }[];
    constructor(params: {
        spec: ParameterSpec.Output;
        instances: {
            value: string;
            name: string;
            prefix: string | null;
        }[];
    });
}
export declare class ErrorFailedToGetDefaultArgument extends Error {
    name: 'ErrorFailedToGetDefaultArgument';
    spec: ParameterSpec.Output;
    constructor(params: {
        spec: ParameterSpec.Output;
        cause: Error;
    });
}
export declare class ErrorMissingArgument extends Error {
    name: 'ErrorMissingArgument';
    spec: ParameterSpec.Output;
    constructor(params: {
        spec: ParameterSpec.Output;
    });
}
export declare class ErrorMissingArgumentForMutuallyExclusiveParameters extends Error {
    name: 'ErrorMissingArgumentForMutuallyExclusiveParameters';
    group: ParameterSpec.Output.ExclusiveGroup;
    constructor(params: {
        group: ParameterSpec.Output.ExclusiveGroup;
    });
}
export declare class ErrorArgumentsToMutuallyExclusiveParameters extends Error {
    name: 'ErrorArgumentsToMutuallyExclusiveParameters';
    group: ParameterSpec.Output.ExclusiveGroup;
    constructor(params: {
        offenses: {
            spec: ParameterSpec.Output.Exclusive;
            arg: OpeningArgs.Argument;
        }[];
    });
}
export declare class ErrorInvalidArgument extends Error {
    name: 'ErrorInvalidArgument';
    spec: ParameterSpec.Output;
    value: unknown;
    constructor(params: {
        spec: ParameterSpec.Output;
        environmentVariableName?: string;
        validationErrors: string[];
        value: unknown;
    });
}
//# sourceMappingURL=Errors.d.ts.map