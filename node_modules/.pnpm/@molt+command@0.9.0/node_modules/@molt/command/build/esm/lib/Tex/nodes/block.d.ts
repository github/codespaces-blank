import type { RenderContext } from './helpers.js';
import { Node } from './node.js';
export interface BlockParameters {
    flow?: 'vertical' | 'horizontal';
    minWidth?: number;
    maxWidth?: number;
    width?: `${number}%`;
    color?: (text: string) => string;
    border?: {
        corners?: string;
        top?: string | ((columnNumber: number) => string);
        left?: string | ((lineNumber: number) => string);
        bottom?: string | ((columnNumber: number) => string);
        right?: string | ((lineNumber: number) => string);
    };
    padding?: {
        top?: number;
        topBetween?: number;
        left?: number;
        bottom?: number;
        bottomBetween?: number;
        right?: number;
    };
    margin?: {
        top?: number;
        left?: number;
        bottom?: number;
        right?: number;
    };
}
export declare class Block extends Node {
    children: Node[];
    parameters: BlockParameters;
    renderings: {
        inner: {
            width: number;
            height: number;
            result: string;
        } | null;
        outer: {
            width: number;
            height: number;
            result: string;
        } | null;
    };
    constructor(parameters: BlockParameters, node: Node);
    constructor(parameters: BlockParameters, nodes: Node[]);
    constructor(parameters: BlockParameters, text: string);
    constructor(nodes: Node[]);
    constructor(node: Node);
    constructor(text: string);
    constructor();
    addChild(node: Node): this;
    setParameters(parameters: BlockParameters): this;
    render(context: RenderContext): {
        shape: {
            intrinsicWidth: number;
            intrinsicHeight: number;
            desiredWidth: number;
        };
        value: string;
    };
}
//# sourceMappingURL=block.d.ts.map