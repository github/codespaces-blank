"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = void 0;
const eventPatterns_js_1 = require("../eventPatterns.js");
const index_js_1 = require("../Help/index.js");
const helpers_js_1 = require("../helpers.js");
const index_js_2 = require("../OpeningArgs/index.js");
const index_js_3 = require("../ParameterSpec/index.js");
const Pattern_js_1 = require("../Pattern/Pattern.js");
const prompt_js_1 = require("./prompt.js");
const ReadLineSync = __importStar(require("readline-sync"));
const parse = (settings, parameterSpecInputs, argInputs) => {
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
        ? (0, helpers_js_1.lowerCaseObjectKeys)(argInputs.environment)
        : (0, helpers_js_1.getLowerCaseEnvironment)();
    // todo handle concept of specs themselves having errors
    const specsResult = {
        specs: index_js_3.ParameterSpec.process(parameterSpecInputs, settings),
    };
    // dump(specsResult)
    const openingArgsResult = index_js_2.OpeningArgs.parse({
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
            const event = (0, eventPatterns_js_1.createEvent)(parseResult);
            // We cannot prompt for this parameter
            if (event === null)
                continue;
            const eventPatterns_ = spec.prompt.when ?? settings.prompt.when;
            const eventPatterns = Array.isArray(eventPatterns_) ? eventPatterns_ : [eventPatterns_];
            for (const pattern of eventPatterns) {
                if ((0, Pattern_js_1.match)(event, pattern)) {
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
        settings.onOutput(index_js_1.Help.render(specsResult.specs, settings) + `\n`);
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
            settings.onOutput(index_js_1.Help.render(specsResult.specs, settings) + `\n`);
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
            settings.onOutput(index_js_1.Help.render(specsResult.specs, settings) + `\n`);
            if (!testDebuggingNoExit)
                process.exit(0);
            throw new Error(`missing args`); // When testing, with process.exit mock, we will reach this case
        }
        return args;
    };
    return hasPrompt
        ? (0, prompt_js_1.prompt)(parseProgressPostPromptAnnotation, argInputsTTY).then(tail)
        : tail(parseProgressPostPromptAnnotation);
};
exports.parse = parse;
//# sourceMappingURL=parse.js.map