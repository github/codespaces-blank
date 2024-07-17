import { Errors } from '../Errors/index.js';
import { groupBy } from '../lib/prelude.js';
import { ParameterSpec } from '../ParameterSpec/index.js';
import { Environment } from './Environment/index.js';
import { Line } from './Line/index.js';
import { Alge } from 'alge';
export { Environment } from './Environment/index.js';
export { Line } from './Line/index.js';
export * from './types.js';
export const parse = (specs, argInputsLine, argInputsEnvironment) => {
    const errors = [];
    const argsFinal = {};
    const env = Environment.parse(argInputsEnvironment, specs);
    const lineParseResult = Line.parse(argInputsLine, specs);
    if (lineParseResult.errors.length > 0)
        errors.push(...lineParseResult.errors);
    // dump({ lineParseResult })
    // dump({ specs })
    // dump({ line })
    // dump({ env })
    const specVariants = groupBy(specs, `_tag`);
    const specVariantsBasicAndUnion = [...(specVariants.Basic ?? []), ...(specVariants.Union ?? [])];
    for (const spec of specVariantsBasicAndUnion) {
        /**
         * A note about types.
         *
         * The parse result of lines and environment arg inputs contains the associated spec
         * object. The results are generic and the spec variant is not known. In this loop we
         * deal with Basic spec variant only. Thus the args picked must be associated with
         * a Basic spec variant too. But the static type of arg.spec does not reflect this fact.
         * It has not been narrowed.
         *
         * No matter, we can just ignore the possibility to use arg.spec here anyways.
         */
        const arg = lineParseResult.line[spec.name.canonical] ?? env[spec.name.canonical];
        if (arg) {
            if (arg.errors.length > 0) {
                errors.push(...arg.errors);
                continue;
            }
            if (arg.duplicates.length > 0) {
                errors.push(new Error(`Duplicate input for parameter ${spec.name.canonical}`));
                continue;
            }
            if (arg.value._tag === `boolean`) {
                argsFinal[spec.name.canonical] = arg.value.negated ? !arg.value.value : arg.value.value;
            }
            else {
                const valueTransformed = ParameterSpec.transform(spec, arg.value.value);
                const result = ParameterSpec.validate(spec, valueTransformed);
                Alge.match(result)
                    .Success((result) => {
                    argsFinal[spec.name.canonical] = result.value;
                })
                    .Failure((result) => {
                    errors.push(new Error(`Invalid value for ${spec.name.canonical}:\n${result.errors.join(`\n`)}`));
                    argsFinal[spec.name.canonical] = undefined;
                })
                    .done();
                if (result._tag === `Failure`) {
                    continue;
                }
            }
            continue;
        }
        if (spec.optionality._tag === `default`) {
            try {
                argsFinal[spec.name.canonical] = spec.optionality.getValue();
            }
            catch (error) {
                errors.push(new Error(`Failed to get default value for ${spec.name.canonical}`, { cause: error }));
                argsFinal[spec.name.canonical] = undefined;
            }
            continue;
        }
        if (spec.optionality._tag === `required`) {
            errors.push(new Errors.ErrorMissingArgument({ spec }));
        }
        argsFinal[spec.name.canonical] = undefined;
    }
    /**
     * Handle exclusive parameter groups:
     *
     * 1. We must handle each group exactly once.
     * 2. If a group is optional and none of its parameters was given an arg then OK
     * 3. If a group is not optional and none of its parameters was given an arg then error
     * 4. If a group has more than one parameter with an arg then error
     * 5. If a group has exactly one parameter with an arg then OK
     */
    const exclusiveGroups = Object.values(groupBy(specVariants.Exclusive ?? [], (spec) => spec.group.label));
    for (const specs of exclusiveGroups) {
        const group = specs[0].group; // eslint-disable-line
        const argsToGroup = specs
            .map((_) => lineParseResult.line[_.name.canonical] ?? env[_.name.canonical])
            .filter((_) => _ !== undefined);
        if (argsToGroup.length === 0) {
            if (group.optionality._tag === `optional`) {
                continue;
            }
            if (group.optionality._tag === `default`) {
                const defaultValue = group.optionality.getValue();
                if (defaultValue) {
                    argsFinal[group.label] = {
                        _tag: group.optionality.tag,
                        value: defaultValue,
                    };
                    continue;
                }
            }
            errors.push(new Errors.ErrorMissingArgumentForMutuallyExclusiveParameters({
                group,
            }));
            continue;
        }
        if (argsToGroup.length > 1) {
            errors.push(new Errors.ErrorArgsToMultipleMutuallyExclusiveParameters({
                offenses: argsToGroup.map((_) => ({ spec: _.spec, arg: _ })),
            }));
            continue;
        }
        if (argsToGroup.length === 1) {
            const arg = argsToGroup[0]; // eslint-disable-line
            argsFinal[group.label] = {
                _tag: arg.spec.name.canonical,
                value: arg.value.value,
            };
            continue;
        }
    }
    // const missingArgs = specsResult.specs
    //         .filter((_) =>
    //           Alge.match(_)
    //             .Basic((_) => !_.optional)
    //             .Exclusive((_) => !_.group.optional)
    //         )
    //         .filter((_) => argsResult.args[_.name.canonical] === undefined)
    // dump({ args })
    return {
        args: argsFinal,
        errors,
    };
};
//# sourceMappingURL=Args.js.map