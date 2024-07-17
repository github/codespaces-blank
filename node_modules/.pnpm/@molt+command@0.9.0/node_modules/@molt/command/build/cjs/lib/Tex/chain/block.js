"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveBlockMethodArgs = exports.block = exports.createBlockBuilder = void 0;
const block_js_1 = require("../nodes/block.js");
const leaf_js_1 = require("../nodes/leaf.js");
const list_js_1 = require("../nodes/list.js");
const helpers_js_1 = require("./helpers.js");
const list_js_2 = require("./list.js");
const root_js_1 = require("./root.js");
const table_js_1 = require("./table.js");
const createBlockBuilder = (params) => {
    const parentNode = new block_js_1.Block();
    const $ = {
        block: (...args) => {
            const input = (0, exports.resolveBlockMethodArgs)(args);
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
            const input = (0, table_js_1.resolveTableMethodArgs)(args);
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
                ? (0, helpers_js_1.toInternalBuilder)(childrenish((0, list_js_2.createListBuilder)()))?._.node ?? null
                : childrenish === null
                    ? null
                    : new list_js_1.List(childrenish.map((_) => typeof _ === `string` ? (_ === null ? null : new block_js_1.Block(new leaf_js_1.Leaf(_))) : _));
            if (child) {
                parentNode.addChild(child);
                if (parameters) {
                    child.setParameters(parameters);
                }
            }
            return params?.getSuperChain() ?? $;
        },
        text: (text) => {
            parentNode.addChild(new leaf_js_1.Leaf(text));
            return params?.getSuperChain() ?? $;
        },
    };
    // Define Internal Methods
    const builderInternal = (0, helpers_js_1.toInternalBuilder)($);
    builderInternal._ = {
        node: parentNode,
    };
    return $;
};
exports.createBlockBuilder = createBlockBuilder;
const block = (...args) => {
    const input = (0, exports.resolveBlockMethodArgs)(args);
    if (input.child && input.parameters) {
        input.child.setParameters(input.parameters);
    }
    return input.child;
};
exports.block = block;
const resolveBlockMethodArgs = (args) => {
    const parameters = args.length === 1 ? null : args[0];
    const childrenInput = args.length === 1 ? args[0] : args[1];
    let child = null;
    if (childrenInput) {
        if (typeof childrenInput === `string`) {
            child = new block_js_1.Block(new leaf_js_1.Leaf(childrenInput));
        }
        else if (childrenInput instanceof block_js_1.Block) {
            child = childrenInput;
        }
        else if (typeof childrenInput === `function`) {
            child = childrenInput;
            const result = childrenInput((0, root_js_1.createRootBuilder)());
            child = result === null ? result : (0, helpers_js_1.toInternalBuilder)(result)._.node;
        }
        else if (Array.isArray(childrenInput)) {
            child = new block_js_1.Block(childrenInput
                .map((_) => _ === null
                ? null
                : _ instanceof block_js_1.Block
                    ? _
                    : typeof _ === `string`
                        ? new leaf_js_1.Leaf(_)
                        : (0, helpers_js_1.toInternalBuilder)(_)?._.node ?? null)
                .filter((_) => _ !== null));
        }
        else {
            child = (0, helpers_js_1.toInternalBuilder)(childrenInput)._.node;
        }
    }
    return { parameters, child };
};
exports.resolveBlockMethodArgs = resolveBlockMethodArgs;
//# sourceMappingURL=block.js.map