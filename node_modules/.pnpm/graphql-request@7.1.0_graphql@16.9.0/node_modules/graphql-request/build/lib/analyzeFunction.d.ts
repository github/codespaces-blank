type Parameter = {
    type: 'name';
    value: string;
} | {
    type: 'destructured';
    names: string[];
};
export declare const analyzeFunction: (fn: (...args: [...any[]]) => unknown) => {
    body: string;
    parameters: Parameter[];
};
export {};
//# sourceMappingURL=analyzeFunction.d.ts.map