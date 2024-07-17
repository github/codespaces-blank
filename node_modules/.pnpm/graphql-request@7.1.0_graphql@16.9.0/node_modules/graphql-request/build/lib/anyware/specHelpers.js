import { beforeEach, vi } from 'vitest';
import { Anyware } from './__.js';
export const initialInput = { value: `initial` };
export const createAnyware = () => {
    const a = vi.fn().mockImplementation((input) => {
        return { value: input.value + `+a` };
    });
    const b = vi.fn().mockImplementation((input) => {
        return { value: input.value + `+b` };
    });
    return Anyware.create({
        hookNamesOrderedBySequence: [`a`, `b`],
        hooks: { a, b },
    });
};
// @ts-expect-error
export let anyware = null;
export let core;
beforeEach(() => {
    // @ts-expect-error mock types not tracked by Anyware
    anyware = createAnyware();
    core = anyware.core;
});
export const runWithOptions = (options = {}) => async (...extensions) => {
    const result = await anyware.run({
        initialInput,
        // @ts-expect-error fixme
        extensions,
        options,
    });
    return result;
};
export const run = async (...extensions) => runWithOptions({})(...extensions);
export const oops = new Error(`oops`);
//# sourceMappingURL=specHelpers.js.map