import type { Directive } from '../../types.js';
export declare const parseClientDirectiveStream: (input: Directive.Stream["$stream"]) => {
    name: string;
    args: {
        if: boolean;
        label: string | undefined;
        initialCount: number | undefined;
    };
};
//# sourceMappingURL=stream.d.ts.map