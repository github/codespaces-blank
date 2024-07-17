import type { MaybeThunk } from '../core/helpers.js';
import type { Any } from './typeGroups.js';
export * from './typeGroups.js';
export * from './types/InputObject.js';
export * from './types/List.js';
export * from './types/Nullable.js';
export declare const field: <$Type extends Any>(type: MaybeThunk<$Type>) => Field<$Type>;
export type Field<$Type extends any = any> = {
    type: $Type;
};
//# sourceMappingURL=Input.d.ts.map