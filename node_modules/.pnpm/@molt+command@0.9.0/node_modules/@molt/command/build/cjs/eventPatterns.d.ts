import type { Errors } from './Errors/index.js';
import type { OpeningArgs } from './OpeningArgs/index.js';
import type { ParameterSpec } from './ParameterSpec/index.js';
import type { Pattern } from './Pattern/Pattern.js';
import type { z } from 'zod';
export type EventPatternsInputAtLeastOne<Schema extends ParameterSpec.Input.Schema> = z.ZodFirstPartyTypeKind.ZodOptional extends Schema['_def']['typeName'] ? Pattern<BasicParameterParseEvent, 'result'> : z.ZodFirstPartyTypeKind.ZodDefault extends Schema['_def']['typeName'] ? Pattern<BasicParameterParseEvent, 'result'> : Pattern<BasicParameterParseEventAccepted | BasicParameterParseEventRejected, 'result'>;
export type EventPatternsInput<Schema extends ParameterSpec.Input.Schema> = Schema['_def']['typeName'] extends z.ZodFirstPartyTypeKind.ZodOptional ? Pattern<BasicParameterParseEvent, 'result'> : Schema['_def']['typeName'] extends z.ZodFirstPartyTypeKind.ZodDefault ? Pattern<BasicParameterParseEvent, 'result'> : Pattern<BasicParameterParseEventAccepted | BasicParameterParseEventRejected, 'result'>;
export type BasicParameterParseEvent = BasicParameterParseEventAccepted | BasicParameterParseEventRejected | BasicParameterParseEventOmitted;
export interface BasicParameterParseEventOmitted {
    result: 'omitted';
    spec: ParameterSpec.Output.BasicData;
}
export interface BasicParameterParseEventAccepted {
    result: 'accepted';
    spec: ParameterSpec.Output.BasicData;
    value: ParameterSpec.ArgumentValue;
}
export interface BasicParameterParseEventRejected {
    result: 'rejected';
    spec: ParameterSpec.Output.BasicData;
    error: Errors.ErrorMissingArgument['name'] | Errors.ErrorInvalidArgument['name'];
}
export declare const createEvent: (parseResult: OpeningArgs.ParseResultBasic) => {
    result: string;
    spec: ParameterSpec.Output.BasicData | ParameterSpec.Output.UnionData;
    value: ParameterSpec.ArgumentValue;
    error?: undefined;
} | {
    result: string;
    spec: ParameterSpec.Output.BasicData | ParameterSpec.Output.UnionData;
    value?: undefined;
    error?: undefined;
} | {
    result: string;
    spec: ParameterSpec.Output.BasicData | ParameterSpec.Output.UnionData;
    error: "ErrorMissingArgument" | "ErrorInvalidArgument";
    value?: undefined;
} | null;
export declare const eventPatterns: {
    always: {};
    omitted: {
        result: "omitted";
    };
    omittedWithoutDefault: {
        result: "omitted";
        spec: {
            optionality: "optional";
        };
    };
    omittedWithDefault: {
        result: "omitted";
        spec: {
            optionality: "default";
        };
    };
    rejectedMissingOrInvalid: {
        result: "rejected";
        error: ("ErrorMissingArgument" | "ErrorInvalidArgument")[];
    };
};
//# sourceMappingURL=eventPatterns.d.ts.map