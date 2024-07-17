"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventPatterns = exports.createEvent = void 0;
const createEvent = (parseResult) => {
    const specData = parseResult.spec._tag === `Basic`
        ? {
            ...parseResult.spec,
            _tag: `BasicData`,
            optionality: parseResult.spec.optionality[`_tag`],
        }
        : {
            ...parseResult.spec,
            _tag: `UnionData`,
            optionality: parseResult.spec.optionality[`_tag`],
            types: parseResult.spec.types.map(({ zodType: _, ...rest }) => rest),
        };
    return parseResult._tag === `supplied`
        ? { result: `accepted`, spec: specData, value: parseResult.value }
        : parseResult._tag === `omitted`
            ? { result: `omitted`, spec: specData }
            : parseResult._tag === `error` &&
                parseResult.errors.length > 0 &&
                // If there are any other kinds of errors than the two named below then we do not, currently, support prompting for that case.
                parseResult.errors.filter((_) => [`ErrorInvalidArgument`, `ErrorMissingArgument`].includes(_.name) === false).length === 0
                ? // It is not possible to have invalid argument and missing argument errors at once.
                    {
                        result: `rejected`,
                        spec: specData,
                        error: parseResult.errors[0].name,
                    }
                : null;
};
exports.createEvent = createEvent;
exports.eventPatterns = {
    always: {},
    omitted: {
        result: `omitted`,
    },
    omittedWithoutDefault: {
        result: `omitted`,
        spec: {
            optionality: `optional`,
        },
    },
    omittedWithDefault: {
        result: `omitted`,
        spec: {
            optionality: `default`,
        },
    },
    rejectedMissingOrInvalid: {
        result: `rejected`,
        error: [`ErrorInvalidArgument`, `ErrorMissingArgument`],
    },
};
//# sourceMappingURL=eventPatterns.js.map