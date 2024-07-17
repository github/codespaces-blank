import { Block } from '../nodes/block.js';
import { Leaf } from '../nodes/leaf.js';
import { List } from '../nodes/list.js';
import { toInternalBuilder } from './helpers.js';
import { createListBuilder } from './list.js';
import { createRootBuilder } from './root.js';
import { resolveTableMethodArgs } from './table.js';
export const createBlockBuilder = (params) => {
    const parentNode = new Block();
    const $ = {
        block: (...args) => {
            const input = resolveBlockMethodArgs(args);
            if (input.child) {
                if (input.parameters) {
                    input.child.setParameters(input.parameters);
                }
                parentNode.addChild(input.child);
            }
            return params?.getSuperChain() ?? $;
        },
        set: (parameters) => {
            parentNode.setParameters(parameters);
            return params?.getSuperChain() ?? $;
        },
        table: (...args) => {
            const input = resolveTableMethodArgs(args);
            if (input.child) {
                if (input.parameters) {
                    input.child.setParameters(input.parameters);
                }
                parentNode.addChild(input.child);
            }
            return params?.getSuperChain() ?? $;
        },
        list: (...args) => {
            const parameters = args.length === 1 ? null : args[0];
            const childrenish = args.length === 1 ? args[0] : args[1];
            const child = typeof childrenish === `function`
                ? toInternalBuilder(childrenish(createListBuilder()))?._.node ?? null
                : childrenish === null
                    ? null
                    : new List(childrenish.map((_) => typeof _ === `string` ? (_ === null ? null : new Block(new Leaf(_))) : _));
            if (child) {
                parentNode.addChild(child);
                if (parameters) {
                    child.setParameters(parameters);
                }
            }
            return params?.getSuperChain() ?? $;
        },
        text: (text) => {
            parentNode.addChild(new Leaf(text));
            return params?.getSuperChain() ?? $;
        },
    };
    // Define Internal Methods
    const builderInternal = toInternalBuilder($);
    builderInternal._ = {
        node: parentNode,
    };
    return $;
};
export const block = (...args) => {
    const input = resolveBlockMethodArgs(args);
    if (input.child && input.parameters) {
        input.child.setParameters(input.parameters);
    }
    return input.child;
};
export const resolveBlockMethodArgs = (args) => {
    const parameters = args.length === 1 ? null : args[0];
    const childrenInput = args.length === 1 ? args[0] : args[1];
    let child = null;
    if (childrenInput) {
        if (typeof childrenInput === `string`) {
            child = new Block(new Leaf(childrenInput));
        }
        else if (childrenInput instanceof Block) {
            child = childrenInput;
        }
        else if (typeof childrenInput === `function`) {
            child = childrenInput;
            const result = childrenInput(createRootBuilder());
            child = result === null ? result : toInternalBuilder(result)._.node;
        }
        else if (Array.isArray(childrenInput)) {
            child = new Block(childrenInput
                .map((_) => _ === null
                ? null
                : _ instanceof Block
                    ? _
                    : typeof _ === `string`
                        ? new Leaf(_)
                        : toInternalBuilder(_)?._.node ?? null)
                .filter((_) => _ !== null));
        }
        else {
            child = toInternalBuilder(childrenInput)._.node;
        }
    }
    return { parameters, child };
};
//# sourceMappingURL=block.js.map