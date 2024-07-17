import { Block } from '../nodes/block.js';
import type { TableParameters } from '../nodes/table.js';
import { Table } from '../nodes/table.js';
import type { BlockBuilder, BlockMethod } from './block.js';
import type { NodeImplementor } from './helpers.js';
type Childish = BlockBuilder | Block | string | null;
export interface TableMethod<Chain> {
    (rows: (Childish[] | null)[]): Chain;
    (builder: NodeImplementor<TableBuilder>): Chain;
    (parameters: TableParameters, builder: NodeImplementor<TableBuilder>): Chain;
}
export type TableMethodArgs = [(Childish[] | null)[]] | [TableParameters, NodeImplementor<TableBuilder>] | [NodeImplementor<TableBuilder>];
export declare const resolveTableMethodArgs: (args: TableMethodArgs) => {
    parameters: TableParameters | null;
    child: null | Table;
};
export interface TableBuilder {
    set(parameters: TableParameters): TableBuilder;
    row(...cells: Childish[]): TableBuilder;
    rows(...rows: (Childish[] | null)[]): TableBuilder;
    rows(rows: (Childish[] | null)[]): TableBuilder;
    headers(headers: (string | Block)[]): TableBuilder;
    header: BlockMethod<TableBuilder>;
}
export declare const createTableBuilder: () => TableBuilder;
export {};
//# sourceMappingURL=table.d.ts.map