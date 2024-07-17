"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTableBuilder = exports.resolveTableMethodArgs = void 0;
const block_js_1 = require("../nodes/block.js");
const leaf_js_1 = require("../nodes/leaf.js");
const table_js_1 = require("../nodes/table.js");
const block_js_2 = require("./block.js");
const helpers_js_1 = require("./helpers.js");
const resolveTableMethodArgs = (args) => {
    const childrenish = args.length === 1 ? args[0] : args[1];
    const parameters = args.length === 1 ? null : args[0];
    const child = typeof childrenish === `function`
        ? (0, helpers_js_1.toInternalBuilder)(childrenish((0, exports.createTableBuilder)()))?._.node ?? null
        : new table_js_1.Table(resolveChildrenish(childrenish));
    return { parameters, child };
};
exports.resolveTableMethodArgs = resolveTableMethodArgs;
const resolveChildrenish = (childrenish) => {
    const resolved = childrenish
        .filter((_) => _ !== null)
        .map((cells) => cells
        .filter((cell) => cell !== null)
        .map((cell) => typeof cell === `string`
        ? new block_js_1.Block(new leaf_js_1.Leaf(cell))
        : cell instanceof block_js_1.Block
            ? cell
            : (0, helpers_js_1.toInternalBuilder)(cell)._.node));
    return resolved;
};
const createTableBuilder = () => {
    const parentNode = new table_js_1.Table();
    const $ = {
        set: (parameters) => {
            parentNode.setParameters(parameters);
            return $;
        },
        row: (...cells) => {
            const cellsNormalized = cells
                .filter((cell) => cell !== null)
                .map((cell) => typeof cell === `string`
                ? new block_js_1.Block(new leaf_js_1.Leaf(cell))
                : cell instanceof block_js_1.Block
                    ? cell
                    : (0, helpers_js_1.toInternalBuilder)(cell)._.node);
            if (cellsNormalized.length > 0) {
                parentNode.rows.push(cellsNormalized);
            }
            return $;
        },
        rows: (...args) => {
            const rows = args.length === 1 && Array.isArray(args[0]?.[0])
                ? args[0]
                : args;
            const rowsNormalized = resolveChildrenish(rows);
            if (rowsNormalized.length > 0) {
                parentNode.rows.push(...rowsNormalized);
            }
            return $;
        },
        headers: (headers) => {
            parentNode.headers = headers.map((_) => (_ instanceof block_js_1.Block ? _ : new block_js_1.Block(new leaf_js_1.Leaf(_))));
            return $;
        },
        header: (...args) => {
            const input = (0, block_js_2.resolveBlockMethodArgs)(args);
            if (input.child) {
                if (input.parameters) {
                    input.child.setParameters(input.parameters);
                }
                parentNode.headers.push(input.child);
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
exports.createTableBuilder = createTableBuilder;
//# sourceMappingURL=table.js.map