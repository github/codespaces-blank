import type { ParseProgressPostPrompt, ParseProgressPostPromptAnnotation } from './parse.js';
export interface TTY {
    output: (text: string) => void;
    input: (params: {
        prompt: string;
    }) => string;
}
/**
 * Get args from the user interactively via the console for the given parameters.
 */
export declare const prompt: (parseProgress: ParseProgressPostPromptAnnotation, tty: null | TTY) => Promise<ParseProgressPostPrompt>;
/**
 * A utility for testing prompts. It allows programmatic control of
 * the input and capturing of the output of a prompts session.
 */
export declare const createMockTTY: () => {
    history: {
        output: string[];
        input: string[];
        all: string[];
    };
    mock: {
        input: {
            add: (values: string[]) => void;
            get: () => string[];
        };
    };
    interface: TTY;
};
export type MockTTY = ReturnType<typeof createMockTTY>;
//# sourceMappingURL=prompt.d.ts.map