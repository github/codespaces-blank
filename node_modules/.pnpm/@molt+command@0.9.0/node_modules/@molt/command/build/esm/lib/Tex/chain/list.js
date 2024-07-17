import { Block } from '../nodes/block.js';
import { Leaf } from '../nodes/leaf.js';
import { List } from '../nodes/list.js';
import { toInternalBuilder } from './helpers.js';
const resolveChild = (child) => {
    if (child === null)
        return null;
    if (typeof child === `string`)
        return new Block(new Leaf(child));
    return child;
};
export const createListBuilder = () => {
    const parentNode = new List();
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
    toInternalBuilder($)._ = {
        node: parentNode,
    };
    return $;
};
//# sourceMappingURL=list.js.map