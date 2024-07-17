import { Block } from '../nodes/block.js';
import type { ListParameters } from '../nodes/list.js';
import type { NodeImplementor } from './helpers.js';
type Childish = string | Block | null;
type Childrenish = Childish[] | null;
export interface ListMethod<Chain> {
    (parameters: ListParameters, children: Childrenish): Chain;
    (children: Childrenish): Chain;
    (builder: NodeImplementor<ListBuilder>): Chain;
}
export type ListArgs = [ListParameters, Childrenish] | [Childrenish] | [NodeImplementor<ListBuilder>];
export interface ListBuilder {
    set(parameters: ListParameters): ListBuilder;
    item(child: Childish): ListBuilder;
    items(...nodes: Childish[]): ListBuilder;
    items(nodes: Childrenish): ListBuilder;
}
export declare const createListBuilder: () => ListBuilder;
export {};
//# sourceMappingURL=list.d.ts.map