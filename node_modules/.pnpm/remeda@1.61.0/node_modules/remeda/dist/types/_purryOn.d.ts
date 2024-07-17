/**
 * Utility for purrying functions based on a predicate for the first argument.
 *
 * This is useful for purrying functions with a variadic argument list.
 */
export declare function purryOn<T>(isArg: (firstArg: unknown) => firstArg is T, implementation: (data: unknown, firstArg: T, ...args: any) => unknown, args: IArguments): unknown;
//# sourceMappingURL=_purryOn.d.ts.map