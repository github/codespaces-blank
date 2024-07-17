import { field } from '../../Field.js';
import { __typename } from './__typename.js';
// Naming this "Object" breaks Vitest: https://github.com/vitest-dev/vitest/issues/5463
export const Object$ = (name, fields) => ({
    kind: `Object`,
    fields: {
        __typename: field(__typename(name)),
        ...fields,
    },
});
export { Object$ as Object };
//# sourceMappingURL=Object.js.map