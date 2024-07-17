export var Global;
(function (Global) {
    class ErrorUnknownParameterViaEnvironment extends Error {
        constructor(params) {
            const message = `Unknown parameter "${params.flagName}"`;
            super(message);
            this.name = `ErrorUnknownParameterViaEnvironment`;
            this.prefix = params.prefix;
        }
    }
    Global.ErrorUnknownParameterViaEnvironment = ErrorUnknownParameterViaEnvironment;
    class ErrorUnknownFlag extends Error {
        constructor(params) {
            const message = `Unknown flag "${params.flagName}"`;
            super(message);
            this.name = `ErrorUnknownFlag`;
        }
    }
    Global.ErrorUnknownFlag = ErrorUnknownFlag;
})(Global || (Global = {}));
export class ErrorDuplicateLineArg extends Error {
    constructor(params) {
        const message = `The parameter "${params.flagName}" was passed an argument multiple times via flags.`;
        super(message);
        this.name = `ErrorDuplicateFlag`;
        this.spec = params.spec;
    }
}
export class ErrorDuplicateEnvArg extends Error {
    constructor(params) {
        const message = `The parameter "${params.spec.name.canonical}" was passed an argument multiple times via different parameter aliases in the environment.`;
        super(message);
        this.name = `ErrorDuplicateEnvArg`;
        this.spec = params.spec;
        this.instances = params.instances;
    }
}
export class ErrorFailedToGetDefaultArgument extends Error {
    constructor(params) {
        const message = `Failed to get default value for ${params.spec.name.canonical}`;
        super(message, { cause: params.cause });
        this.name = `ErrorFailedToGetDefaultArgument`;
        this.spec = params.spec;
    }
}
export class ErrorMissingArgument extends Error {
    constructor(params) {
        const message = `Missing argument for flag "${params.spec.name.canonical}".`;
        super(message);
        this.name = `ErrorMissingArgument`;
        this.spec = params.spec;
    }
}
export class ErrorMissingArgumentForMutuallyExclusiveParameters extends Error {
    constructor(params) {
        const message = `Missing argument for one of the following parameters: ${Object.values(params.group.parameters)
            .map((_) => _.name.canonical)
            .join(`, `)}`;
        super(message);
        this.name = `ErrorMissingArgumentForMutuallyExclusiveParameters`;
        this.group = params.group;
    }
}
export class ErrorArgumentsToMutuallyExclusiveParameters extends Error {
    constructor(params) {
        const message = `Arguments given to multiple mutually exclusive parameters: ${params.offenses
            .map((_) => _.spec.name.canonical)
            .join(`, `)}`;
        super(message);
        this.name = `ErrorArgumentsToMutuallyExclusiveParameters`;
        this.group = params.offenses[0].spec.group;
    }
}
export class ErrorInvalidArgument extends Error {
    constructor(params) {
        const message = `Invalid argument${params.environmentVariableName
            ? ` (via environment variable "${params.environmentVariableName}") `
            : ` `}for parameter: "${params.spec.name.canonical}". The error was:\n${params.validationErrors.join(`\n`)}`;
        super(message);
        this.name = `ErrorInvalidArgument`;
        this.spec = params.spec;
        this.value = params.value;
    }
}
//# sourceMappingURL=Errors.js.map