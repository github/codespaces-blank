import type { BlockParameters } from './block.js';
import { Block } from './block.js';
import type { RenderContext } from './helpers.js';
import { Node } from './node.js';
export interface ListParameters {
    padding?: BlockParameters['padding'];
    bullet?: {
        graphic?: string | ((index: number) => string);
        align?: {
            horizontal?: 'left' | 'right';
        };
    };
}
export declare class List extends Node {
    items: Block[];
    parameters: ListParameters;
    constructor(items?: (string | Block | null)[]);
    setParameters(parameters: ListParameters): this;
    render(context: RenderContext): {
        shape: {
            intrinsicWidth: number;
            intrinsicHeight: number;
            desiredWidth: null;
        };
        value: string;
    };
}
//# sourceMappingURL=list.d.ts.map