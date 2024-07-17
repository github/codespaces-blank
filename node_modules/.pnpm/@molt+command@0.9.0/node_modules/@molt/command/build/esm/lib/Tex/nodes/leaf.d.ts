import type { RenderContext } from './helpers.js';
import { Node } from './node.js';
export declare class Leaf extends Node {
    value: string;
    constructor(value: string);
    render(context: RenderContext): {
        shape: {
            intrinsicWidth: number;
            intrinsicHeight: number;
            desiredWidth: null;
        };
        value: string;
    };
}
//# sourceMappingURL=leaf.d.ts.map