import { assertObject } from '../../lib/prelude.js';
// eslint-disable-next-line
export function assertGraphQLObject(v) {
    assertObject(v);
    if (`__typename` in v && typeof v.__typename !== `string`) {
        throw new Error(`Expected string __typename or undefined. Got: ${String(v.__typename)}`);
    }
}
//# sourceMappingURL=runtime.js.map