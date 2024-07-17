import { readMaybeThunk } from '../core/helpers.js';
export * from './typeGroups.js';
export * from './types/__typename.js';
export * from './types/Interface.js';
export * from './types/List.js';
export * from './types/Nullable.js';
export * from './types/Object.js';
export * from './types/Union.js';
export const unwrapNullable = (type) => {
    if (type.kind === `nullable`)
        return type.type;
    return type;
};
export const unwrapToNamed = (type) => {
    // @ts-expect-error fixme
    return type.kind === `list` || type.kind === `nullable` ? unwrapToNamed(readMaybeThunk(type).type) : type;
};
//# sourceMappingURL=Output.js.map