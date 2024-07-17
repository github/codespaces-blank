import type { BlockParameters } from '../nodes/block.js';
import { Block } from '../nodes/block.js';
import type { NodeImplementor } from './helpers.js';
import type { ListMethod } from './list.js';
import type { TableMethod } from './table.js';
type Childish = string | null | BlockBuilder | Block;
type Childrenish = Childish | Childish[];
export interface BlockMethod<Chain> {
    (builder: ($: BlockBuilder) => null | BlockBuilder): Chain;
    (child: Childrenish): Chain;
    (parameters: BlockParameters, children: Childrenish): Chain;
    (parameters: BlockParameters, builder: ($: BlockBuilder) => null | BlockBuilder): Chain;
}
export interface BlockBuilder<Chain = null> {
    block: BlockMethod<Chain extends null ? BlockBuilder : Chain>;
    table: TableMethod<Chain extends null ? BlockBuilder : Chain>;
    list: ListMethod<Chain extends null ? BlockBuilder : Chain>;
    text(text: string): Chain extends null ? BlockBuilder : Chain;
    set(parameters: BlockParameters): Chain extends null ? BlockBuilder : Chain;
}
export type BlockMethodArgs = [BlockParameters, Childrenish] | [Childrenish] | [NodeImplementor<BlockBuilder>] | [BlockParameters, NodeImplementor<BlockBuilder>];
export declare const createBlockBuilder: (params?: {
    getSuperChain: () => any;
}) => BlockBuilder;
export declare const block: (...args: BlockMethodArgs) => Block | null;
export declare const resolveBlockMethodArgs: (args: BlockMethodArgs) => {
    parameters: BlockParameters | null;
    child: Block | null;
};
export {};
//# sourceMappingURL=block.d.ts.map