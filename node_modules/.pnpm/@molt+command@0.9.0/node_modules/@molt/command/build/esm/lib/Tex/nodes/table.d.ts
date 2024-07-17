import type { Block } from './block.js';
import type { RenderContext } from './helpers.js';
import { Node } from './node.js';
export interface TableParameters {
    separators?: {
        row?: string | null;
        column?: string;
    };
}
export declare class Table extends Node {
    rows: Block[][];
    headers: Block[];
    parameters: TableParameters;
    constructor(rows?: Block[][]);
    setParameters(parameters: TableParameters): this;
    render(context: RenderContext): {
        shape: {
            intrinsicWidth: number;
            intrinsicHeight: number;
            desiredWidth: number;
        };
        value: string;
    };
}
//# sourceMappingURL=table.d.ts.map