import { Args } from './Args/index.js';
import { Help } from './Help/index.js';
import { getLowerCaseEnvironment, lowerCaseObjectKeys } from './helpers.js';
import { ParameterSpec } from './ParameterSpec/index.js';
export const parse = (settings, parameterSpecInputs, argInputs) => {
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
        ? lowerCaseObjectKeys(argInputs.environment)
        : getLowerCaseEnvironment();
    // todo handle concept of specs themselves having errors
    const specsResult = {
        specs: ParameterSpec.process(parameterSpecInputs, settings),
    };
    const argsResult = Args.parse(specsResult.specs, argInputsLine, argInputsEnvironment);
    // eslint-disable-next-line
    // @ts-expect-error
    const askedForHelp = `help` in argsResult.args && argsResult.args.help === true;
    if (askedForHelp) {
        settings.onOutput(Help.render(specsResult.specs, settings) + `\n`);
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
            settings.onOutput(Help.render(specsResult.specs, settings) + `\n`);
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
        settings.onOutput(Help.render(specsResult.specs, settings) + `\n`);
        if (!testDebuggingNoExit)
            process.exit(0);
        throw new Error(`missing args`); // When testing, with process.exit mock, we will reach this case
    }
    return argsResult.args;
};
//# sourceMappingURL=parse.js.map