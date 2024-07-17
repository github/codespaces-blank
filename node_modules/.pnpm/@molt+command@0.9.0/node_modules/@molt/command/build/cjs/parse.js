"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = void 0;
const index_js_1 = require("./Args/index.js");
const index_js_2 = require("./Help/index.js");
const helpers_js_1 = require("./helpers.js");
const index_js_3 = require("./ParameterSpec/index.js");
const parse = (settings, parameterSpecInputs, argInputs) => {
    // // Resolve settings
    // $.settings = {
    //   ...Settings.getDefaults(argInputsEnvironment),
    // }
    // $.newSettingsBuffer.forEach((newSettings) =>
    //   Settings.change($.settings!, newSettings, argInputsEnvironment)
    // )
    const testDebuggingNoExit = process.env[`testing_molt`] === `true`;
    const argInputsLine = argInputs?.line ?? process.argv.slice(2);
    const argInputsEnvironment = argInputs?.environment
        ? (0, helpers_js_1.lowerCaseObjectKeys)(argInputs.environment)
        : (0, helpers_js_1.getLowerCaseEnvironment)();
    // todo handle concept of specs themselves having errors
    const specsResult = {
        specs: index_js_3.ParameterSpec.process(parameterSpecInputs, settings),
    };
    const argsResult = index_js_1.Args.parse(specsResult.specs, argInputsLine, argInputsEnvironment);
    // eslint-disable-next-line
    // @ts-expect-error
    const askedForHelp = `help` in argsResult.args && argsResult.args.help === true;
    if (askedForHelp) {
        settings.onOutput(index_js_2.Help.render(specsResult.specs, settings) + `\n`);
        if (!testDebuggingNoExit)
            process.exit(0);
        return undefined; // When testing, with process.exit mock, we will reach this case
    }
    if (argsResult.errors.length > 0) {
        if (settings.helpOnError) {
            const message = `Cannot run command, you made some mistakes:\n\n` +
                argsResult.errors.map((_) => _.message).join(`\nX `) +
                `\n\nHere are the docs for this command:\n`;
            settings.onOutput(message + `\n`);
            settings.onOutput(index_js_2.Help.render(specsResult.specs, settings) + `\n`);
        }
        if (settings.onError === `exit` && !testDebuggingNoExit) {
            process.exit(1);
            return undefined; // When testing, with process.exit mock, we will reach this case
        }
        if (argsResult.errors.length > 1)
            throw new AggregateError(argsResult.errors);
        else
            throw argsResult.errors[0];
    }
    if (settings.helpOnNoArguments && Object.values(argsResult.args).length === 0) {
        settings.onOutput(index_js_2.Help.render(specsResult.specs, settings) + `\n`);
        if (!testDebuggingNoExit)
            process.exit(0);
        throw new Error(`missing args`); // When testing, with process.exit mock, we will reach this case
    }
    return argsResult.args;
};
exports.parse = parse;
//# sourceMappingURL=parse.js.map