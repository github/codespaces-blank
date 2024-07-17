import { Block } from '../nodes/block.js';
import { Leaf } from '../nodes/leaf.js';
import { Table } from '../nodes/table.js';
import { resolveBlockMethodArgs } from './block.js';
import { toInternalBuilder } from './helpers.js';
export const resolveTableMethodArgs = (args) => {
    const childrenish = args.length === 1 ? args[0] : args[1];
    const parameters = args.length === 1 ? null : args[0];
    const child = typeof childrenish === `function`
        ? toInternalBuilder(childrenish(createTableBuilder()))?._.node ?? null
        : new Table(resolveChildrenish(childrenish));
    return { parameters, child };
};
const resolveChildrenish = (childrenish) => {
    const resolved = childrenish
        .filter((_) => _ !== null)
        .map((cells) => cells
        .filter((cell) => cell !== null)
        .map((cell) => typeof cell === `string`
        ? new Block(new Leaf(cell))
        : cell instanceof Block
            ? cell
            : toInternalBuilder(cell)._.node));
    return resolved;
};
export const createTableBuilder = () => {
    const parentNode = new Table();
    const $ = {
        set: (parameters) => {
            parentNode.setParameters(parameters);
            return $;
        },
        row: (...cells) => {
            const cellsNormalized = cells
                .filter((cell) => cell !== null)
                .map((cell) => typeof cell === `string`
                ? new Block(new Leaf(cell))
                : cell instanceof Block
                    ? cell
                    : toInternalBuilder(cell)._.node);
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
            parentNode.headers = headers.map((_) => (_ instanceof Block ? _ : new Block(new Leaf(_))));
            return $;
        },
        header: (...args) => {
            const input = resolveBlockMethodArgs(args);
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
    toInternalBuilder($)._ = {
        node: parentNode,
    };
    return $;
};
//# sourceMappingURL=table.js.map