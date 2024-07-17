"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorInvalidArgument = exports.ErrorArgumentsToMutuallyExclusiveParameters = exports.ErrorMissingArgumentForMutuallyExclusiveParameters = exports.ErrorMissingArgument = exports.ErrorFailedToGetDefaultArgument = exports.ErrorDuplicateEnvArg = exports.ErrorDuplicateLineArg = exports.Global = void 0;
var Global;
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
})(Global || (exports.Global = Global = {}));
class ErrorDuplicateLineArg extends Error {
    constructor(params) {
        const message = `The parameter "${params.flagName}" was passed an argument multiple times via flags.`;
        super(message);
        this.name = `ErrorDuplicateFlag`;
        this.spec = params.spec;
    }
}
exports.ErrorDuplicateLineArg = ErrorDuplicateLineArg;
class ErrorDuplicateEnvArg extends Error {
    constructor(params) {
        const message = `The parameter "${params.spec.name.canonical}" was passed an argument multiple times via different parameter aliases in the environment.`;
        super(message);
        this.name = `ErrorDuplicateEnvArg`;
        this.spec = params.spec;
        this.instances = params.instances;
    }
}
exports.ErrorDuplicateEnvArg = ErrorDuplicateEnvArg;
class ErrorFailedToGetDefaultArgument extends Error {
    constructor(params) {
        const message = `Failed to get default value for ${params.spec.name.canonical}`;
        super(message, { cause: params.cause });
        this.name = `ErrorFailedToGetDefaultArgument`;
        this.spec = params.spec;
    }
}
exports.ErrorFailedToGetDefaultArgument = ErrorFailedToGetDefaultArgument;
class ErrorMissingArgument extends Error {
    constructor(params) {
        const message = `Missing argument for flag "${params.spec.name.canonical}".`;
        super(message);
        this.name = `ErrorMissingArgument`;
        this.spec = params.spec;
    }
}
exports.ErrorMissingArgument = ErrorMissingArgument;
class ErrorMissingArgumentForMutuallyExclusiveParameters extends Error {
    constructor(params) {
        const message = `Missing argument for one of the following parameters: ${Object.values(params.group.parameters)
            .map((_) => _.name.canonical)
            .join(`, `)}`;
        super(message);
        this.name = `ErrorMissingArgumentForMutuallyExclusiveParameters`;
        this.group = params.group;
    }
}
exports.ErrorMissingArgumentForMutuallyExclusiveParameters = ErrorMissingArgumentForMutuallyExclusiveParameters;
class ErrorArgumentsToMutuallyExclusiveParameters extends Error {
    constructor(params) {
        const message = `Arguments given to multiple mutually exclusive parameters: ${params.offenses
            .map((_) => _.spec.name.canonical)
            .join(`, `)}`;
        super(message);
        this.name = `ErrorArgumentsToMutuallyExclusiveParameters`;
        this.group = params.offenses[0].spec.group;
    }
}
exports.ErrorArgumentsToMutuallyExclusiveParameters = ErrorArgumentsToMutuallyExclusiveParameters;
class ErrorInvalidArgument extends Error {
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
exports.ErrorInvalidArgument = ErrorInvalidArgument;
//# sourceMappingURL=Errors.js.map