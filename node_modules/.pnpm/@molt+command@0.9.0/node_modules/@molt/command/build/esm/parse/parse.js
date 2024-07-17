import { createEvent } from '../eventPatterns.js';
import { Help } from '../Help/index.js';
import { getLowerCaseEnvironment, lowerCaseObjectKeys } from '../helpers.js';
import { OpeningArgs } from '../OpeningArgs/index.js';
import { ParameterSpec } from '../ParameterSpec/index.js';
import { match } from '../Pattern/Pattern.js';
import { prompt } from './prompt.js';
import * as ReadLineSync from 'readline-sync';
export const parse = (settings, parameterSpecInputs, argInputs) => {
    const testDebuggingNoExit = process.env[`testing_molt`] === `true`;
    const argInputsTTY = argInputs?.tty ??
        (process.stdout.isTTY
            ? {
                output: console.log,
                input: (params) => ReadLineSync.question(params.prompt),
            }
            : null);
    const argInputsLine = argInputs?.line ?? process.argv.slice(2);
    const argInputsEnvironment = argInputs?.environment
        ? lowerCaseObjectKeys(argInputs.environment)
        : getLowerCaseEnvironment();
    // todo handle concept of specs themselves having errors
    const specsResult = {
        specs: ParameterSpec.process(parameterSpecInputs, settings),
    };
    // dump(specsResult)
    const openingArgsResult = OpeningArgs.parse({
        specs: specsResult.specs,
        line: argInputsLine,
        environment: argInputsEnvironment,
    });
    /**
     * Build up a list of parameter prompts. A parameter prompt is added when there is a matching event pattern.
     */
    const parseProgressPostPromptAnnotation = {
        ...openingArgsResult,
        basicParameters: Object.fromEntries(Object.entries(openingArgsResult.basicParameters).map(([parameterName, openingParseResult]) => {
            const data = {
                openingParseResult,
                spec: openingParseResult.spec,
                prompt: {
                    enabled: false,
                },
            };
            return [parameterName, data];
        })),
    };
    if (argInputsTTY) {
        const basicSpecs = specsResult.specs.filter((_) => _._tag === `Basic`);
        for (const spec of basicSpecs) {
            const promptEnabled = (spec.prompt.when !== null && spec.prompt.enabled !== false) ||
                (spec.prompt.enabled ?? settings.prompt.enabled);
            if (!promptEnabled)
                continue;
            const parseResult = openingArgsResult.basicParameters[spec.name.canonical];
            if (!parseResult)
                throw new Error(`something went wrong, could not get arg parse result`);
            const event = createEvent(parseResult);
            // We cannot prompt for this parameter
            if (event === null)
                continue;
            const eventPatterns_ = spec.prompt.when ?? settings.prompt.when;
            const eventPatterns = Array.isArray(eventPatterns_) ? eventPatterns_ : [eventPatterns_];
            for (const pattern of eventPatterns) {
                if (match(event, pattern)) {
                    parseProgressPostPromptAnnotation.basicParameters[spec.name.canonical].prompt.enabled = true;
                    continue;
                }
            }
        }
    }
    // eslint-disable-next-line
    const askedForHelp = `help` in openingArgsResult.basicParameters &&
        openingArgsResult.basicParameters[`help`]._tag === `supplied` &&
        openingArgsResult.basicParameters[`help`].value === true;
    if (askedForHelp) {
        settings.onOutput(Help.render(specsResult.specs, settings) + `\n`);
        if (!testDebuggingNoExit)
            process.exit(0);
        return undefined; // When testing, with process.exit mock, we WILL reach this case
    }
    /**
     * If there are global errors then we must abort as it compromises the program intent.
     * A global error could be something like the user having supplied an unknown parameter.
     *
     * Likewise if there are argument errors that are NOT going to be prompted for, we must abort too.
     */
    const argumentErrors = [
        ...Object.entries(parseProgressPostPromptAnnotation.basicParameters)
            .map(([_, v]) => {
            return v.prompt.enabled === false && v.openingParseResult._tag === `error`
                ? v.openingParseResult
                : null;
        })
            .filter((_) => _ !== null),
        ...Object.entries(parseProgressPostPromptAnnotation.mutuallyExclusiveParameters)
            .map(([_, v]) => {
            return v._tag === `error` ? v : null;
        })
            .filter((_) => _ !== null),
    ];
    if (parseProgressPostPromptAnnotation.globalErrors.length > 0 || argumentErrors.length > 0) {
        if (settings.helpOnError) {
            const message = `Cannot run command, you made some mistakes:\n\n` +
                openingArgsResult.globalErrors.map((_) => _.message).join(`\nX `) +
                argumentErrors.map((_) => _.errors.map((_) => _.message).join(`\nX `)).join(`\nX `) +
                `\n\nHere are the docs for this command:\n`;
            settings.onOutput(message + `\n`);
            settings.onOutput(Help.render(specsResult.specs, settings) + `\n`);
        }
        if (settings.onError === `exit` && !testDebuggingNoExit) {
            process.exit(1);
            return undefined; // When testing, with process.exit mock, we will reach this case
        }
        const allErrors = [
            ...openingArgsResult.globalErrors,
            ...argumentErrors.map((_) => (_.errors.length > 1 ? new AggregateError(_.errors) : _.errors[0])),
        ];
        if (allErrors.length > 1) {
            throw new AggregateError(allErrors);
        }
        else {
            throw allErrors[0];
        }
    }
    const hasPrompt = Object.values(parseProgressPostPromptAnnotation.basicParameters).some((_) => _.prompt.enabled) &&
        argInputsTTY;
    /**
     * Progress to the next parse stage wherein we will execute prompts.
     */
    const tail = (parseProgressPostPrompts) => {
        const args = {
            ...Object.fromEntries(Object.entries(parseProgressPostPrompts.basicParameters)
                .map(([k, v]) => {
                return [
                    k,
                    v.prompt.enabled
                        ? v.prompt.arg
                        : v.openingParseResult._tag === `supplied`
                            ? v.openingParseResult.value
                            : null,
                ];
            })
                .filter((kv) => kv[1] !== null)),
            ...Object.fromEntries(Object.values(parseProgressPostPrompts.mutuallyExclusiveParameters)
                .filter((_) => _._tag === `supplied`)
                .map((v) => [v.spec.label, v.value])),
        };
        /**
         * Handle the distinct case of no arguments. Sometimes the CLI author wants this to mean "show help".
         */
        if (settings.helpOnNoArguments && Object.values(args).length === 0) {
            settings.onOutput(Help.render(specsResult.specs, settings) + `\n`);
            if (!testDebuggingNoExit)
                process.exit(0);
            throw new Error(`missing args`); // When testing, with process.exit mock, we will reach this case
        }
        return args;
    };
    return hasPrompt
        ? prompt(parseProgressPostPromptAnnotation, argInputsTTY).then(tail)
        : tail(parseProgressPostPromptAnnotation);
};
//# sourceMappingURL=parse.js.map