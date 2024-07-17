"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.render = exports.createRootBuilder = void 0;
const block_js_1 = require("./block.js");
const helpers_js_1 = require("./helpers.js");
const createRootBuilder = (parameters) => {
    const builder = (0, block_js_1.createBlockBuilder)({ getSuperChain: () => builder });
    const builderInternal = (0, helpers_js_1.toInternalBuilder)(builder);
    builderInternal._.node.setParameters({
        maxWidth: process.stdout.columns,
        ...parameters,
    });
    builder.render = () => (0, exports.render)(builder);
    return builder;
};
exports.createRootBuilder = createRootBuilder;
const render = (builder) => {
    const result = (0, helpers_js_1.toInternalBuilder)(builder)._.node.render({
        index: {
            isFirst: true,
            isLast: true,
            position: 0,
            total: 1,
        },
    });
    return result.value;
};
exports.render = render;
//# sourceMappingURL=root.js.map