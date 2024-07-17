import type { RequestDocument } from './types.js';
export declare const analyzeDocument: (document: RequestDocument, excludeOperationName?: boolean) => {
    expression: string;
    operationName: string | undefined;
    isMutation: boolean;
};
//# sourceMappingURL=analyzeDocument.d.ts.map