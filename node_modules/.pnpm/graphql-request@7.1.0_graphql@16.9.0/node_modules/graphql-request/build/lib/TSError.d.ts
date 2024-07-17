export declare const TypeErrorSymbol: unique symbol;
export type TSError<Location extends string, Message extends string, Context extends Record<string, unknown> = never> = {
    [TypeErrorSymbol]: true;
    message: `Error (${Location}): ${Message}`;
    context: Context;
};
//# sourceMappingURL=TSError.d.ts.map