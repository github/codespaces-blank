export * from './typeGroups.js';
export * from './types/InputObject.js';
export * from './types/List.js';
export * from './types/Nullable.js';
export const field = (type) => {
    return {
        // Thunks do not exist at the type level
        type: type, // eslint-disable-line
    };
};
//# sourceMappingURL=Input.js.map