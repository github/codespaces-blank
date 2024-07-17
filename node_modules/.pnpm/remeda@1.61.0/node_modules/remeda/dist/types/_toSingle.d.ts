type Single<Func> = Func & {
    readonly single: true;
};
export declare const _toSingle: <Func extends (...args: any) => unknown>(fn: Func) => Single<Func>;
export {};
//# sourceMappingURL=_toSingle.d.ts.map