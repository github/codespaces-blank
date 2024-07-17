"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMockTTY = exports.prompt = void 0;
const index__js_1 = require("../lib/Tex/index_.js");
const index_js_1 = require("../lib/Text/index.js");
const index_js_2 = require("../ParameterSpec/index.js");
const term_js_1 = require("../term.js");
/**
 * Get args from the user interactively via the console for the given parameters.
 */
// export const prompt = (specs: ParameterSpec.Output[], tty: TTY): Record<string, any> => {
const prompt = (parseProgress, tty) => {
    if (tty === null)
        return Promise.resolve(parseProgress);
    const args = {};
    const specs = Object.entries(parseProgress.basicParameters)
        .filter((_) => _[1].prompt.enabled)
        .map((_) => _[1].spec);
    const indexTotal = specs.length;
    let indexCurrent = 1;
    const gutterWidth = String(indexTotal).length * 2 + 3;
    for (const spec of specs) {
        // prettier-ignore
        const question = (0, index__js_1.Tex)({ flow: `horizontal` })
            .block({ padding: { right: 2 } }, `${term_js_1.Term.colors.dim(`${indexCurrent}/${indexTotal}`)}`)
            .block((__) => __.block(term_js_1.Term.colors.positive(spec.name.canonical))
            .block((spec.description && term_js_1.Term.colors.dim(spec.description)) ?? null))
            .render();
        tty.output(question);
        // eslint-disable-next-line no-constant-condition
        while (true) {
            const arg = tty.input({ prompt: `${index_js_1.Text.pad(`left`, gutterWidth, index_js_1.Text.chars.space, `❯ `)}` });
            const validationResult = index_js_2.ParameterSpec.validate(spec, arg);
            if (validationResult._tag === `Success`) {
                args[spec.name.canonical] = validationResult.value;
                tty.output(index_js_1.Text.chars.newline);
                indexCurrent++;
                break;
            }
            else {
                tty.output(index_js_1.Text.pad(`left`, gutterWidth, ` `, term_js_1.Term.colors.alert(`Invalid value: ${validationResult.errors.join(`, `)}`)));
            }
        }
    }
    // todo do not mutate
    const parseProgressPostPrompt = parseProgress;
    for (const [parameterName, arg] of Object.entries(args)) {
        parseProgressPostPrompt.basicParameters[parameterName].prompt.arg = arg; // eslint-disable-line
    }
    return Promise.resolve(parseProgressPostPrompt);
};
exports.prompt = prompt;
/**
 * A utility for testing prompts. It allows programmatic control of
 * the input and capturing of the output of a prompts session.
 */
const createMockTTY = () => {
    const state = {
        inputScript: [],
        history: {
            input: [],
            output: [],
            all: [],
        },
    };
    const tty = {
        output: (value) => {
            state.history.output.push(value);
            state.history.all.push(value);
        },
        input: () => {
            const value = state.inputScript.shift();
            if (value === undefined) {
                throw new Error(`No more values in read script.`);
            }
            state.history.input.push(value);
            state.history.all.push(value);
            return value;
        },
    };
    return {
        // state,
        history: state.history,
        mock: {
            input: {
                add: (values) => {
                    state.inputScript.push(...values);
                },
                get: () => state.inputScript,
            },
        },
        interface: tty,
    };
};
exports.createMockTTY = createMockTTY;
//# sourceMappingURL=prompt.js.map