import { processEnvironment } from '../helpers/environment.js';
import { processName } from '../helpers/name.js';
import { analyzeZodTypeScalar } from '../helpers/zod.js';
import { Alge } from 'alge';
export const processExclusive = (label, input, settings) => {
    const parameters = input.parameters.map((_) => {
        const name = processName(_.nameExpression);
        const environment = processEnvironment(settings, name);
        const typeAnalysis = analyzeZodTypeScalar(_.type);
        return {
            _tag: `Exclusive`,
            description: typeAnalysis.description,
            type: typeAnalysis.type,
            environment,
            name,
            // See comment/code below: (1)
            group: null, // eslint-disable-line
        };
    });
    /**
     * (1) Link up the group to each value and vice versa. Cannot do this in the above constructor since
     * it would create a copy of group for each value.
     */
    const group = {
        label,
        // Input exclusive default allows default to be value or thunk,
        // while output is always thunk.
        optionality: Alge.match(input.optionality)
            .default((_) => ({
            _tag: `default`,
            tag: _.tag,
            getValue: () => (typeof _.value === `function` ? _.value() : _.value),
        }))
            .else((_) => _),
        parameters: {},
    };
    parameters.forEach((_) => {
        _.group = group;
        group.parameters[_.name.canonical] = _;
    });
    return parameters;
};
//# sourceMappingURL=exclusive.js.map