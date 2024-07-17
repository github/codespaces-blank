import { processBasic } from './parameterTypes/basic.js';
import { processExclusive } from './parameterTypes/exclusive.js';
import { processUnion } from './parameterTypes/union.js';
import { Alge } from 'alge';
import { z } from 'zod';
/**
 * Process the spec input into a normalized spec.
 */
export const process = (inputs, settings) => {
    const inputsWithHelp = settings.help
        ? {
            ...inputs,
            '-h --help': helpParameter,
        }
        : inputs;
    const outputs = Object.entries(inputsWithHelp).flatMap(([expression, input]) => Alge.match(input)
        .Basic((_) => [processBasic(expression, _, settings)])
        .Union((_) => [processUnion(expression, _, settings)])
        .Exclusive((_) => processExclusive(expression, _, settings))
        .done());
    // dump({ outputs })
    return outputs;
};
const helpParameter = {
    _tag: `Basic`,
    type: z.boolean().default(false),
    nameExpression: `-h --help`,
    prompt: false,
};
//# sourceMappingURL=process.js.map