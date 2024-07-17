/**
 * Helper for implementing ADT `is` functions.
 *
 * @remarks This looks for a `.symbol` property on the given value and if it exists checks if it matches the given symbol.
 *
 * This is how nominal-like typing is achieved with the ADTs.
 */
export declare const is: (value: unknown, symbol: symbol) => boolean;
//# sourceMappingURL=helpers.d.ts.map