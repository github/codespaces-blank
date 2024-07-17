"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createListBuilder = void 0;
const block_js_1 = require("../nodes/block.js");
const leaf_js_1 = require("../nodes/leaf.js");
const list_js_1 = require("../nodes/list.js");
const helpers_js_1 = require("./helpers.js");
const resolveChild = (child) => {
    if (child === null)
        return null;
    if (typeof child === `string`)
        return new block_js_1.Block(new leaf_js_1.Leaf(child));
    return child;
};
const createListBuilder = () => {
    const parentNode = new list_js_1.List();
    const $ = {
        set: (parameters) => {
            parentNode.setParameters(parameters);
            return $;
        },
        item: (childish) => {
            const child = resolveChild(childish);
            if (child) {
                parentNode.items.push(child);
            }
            return $;
        },
        items: (...args) => {
            const childrenish = args.length === 1 && Array.isArray(args[0]) ? args[0] : args;
            if (childrenish === null)
                return $;
            const nodes = childrenish.filter((_) => _ !== null).map(resolveChild);
            if (nodes.length > 0) {
                parentNode.items.push(...nodes);
            }
            return $;
        },
    };
    // Define Internal Methods
    (0, helpers_js_1.toInternalBuilder)($)._ = {
        node: parentNode,
    };
    return $;
};
exports.createListBuilder = createListBuilder;
//# sourceMappingURL=list.js.map