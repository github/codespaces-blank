import type { RenderContext, Shape } from './helpers.js';
export declare abstract class Node {
    abstract render(context: RenderContext): {
        shape: Shape;
        value: string;
    };
}
//# sourceMappingURL=node.d.ts.map