import type { BlockParameters } from '../nodes/block.js';
import type { BlockBuilder } from './block.js';
import type { Builder } from './helpers.js';
export interface RootBuilder extends BlockBuilder<RootBuilder> {
    render(): string;
}
export declare const createRootBuilder: (parameters?: BlockParameters) => RootBuilder;
export declare const render: (builder: Builder) => string;
//# sourceMappingURL=root.d.ts.map