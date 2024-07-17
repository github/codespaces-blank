import type { BlockParameters } from './block.js';
export interface RenderContext {
    maxWidth?: undefined | number;
    height?: undefined | number;
    color?: undefined | ((text: string) => string);
    phase?: undefined | 'inner' | 'outer';
    index: {
        total: number;
        isLast: boolean;
        isFirst: boolean;
        position: number;
    };
}
export interface Shape {
    intrinsicWidth: number;
    intrinsicHeight: number;
    desiredWidth: number | null;
}
export declare const applyPadding: (value: string, padding: Exclude<BlockParameters['padding'], undefined>, context: Pick<RenderContext, 'index'>) => string;
//# sourceMappingURL=helpers.d.ts.map