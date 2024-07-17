import { createBlockBuilder } from './block.js';
import { toInternalBuilder } from './helpers.js';
export const createRootBuilder = (parameters) => {
    const builder = createBlockBuilder({ getSuperChain: () => builder });
    const builderInternal = toInternalBuilder(builder);
    builderInternal._.node.setParameters({
        maxWidth: process.stdout.columns,
        ...parameters,
    });
    builder.render = () => render(builder);
    return builder;
};
export const render = (builder) => {
    const result = toInternalBuilder(builder)._.node.render({
        index: {
            isFirst: true,
            isLast: true,
            position: 0,
            total: 1,
        },
    });
    return result.value;
};
//# sourceMappingURL=root.js.map