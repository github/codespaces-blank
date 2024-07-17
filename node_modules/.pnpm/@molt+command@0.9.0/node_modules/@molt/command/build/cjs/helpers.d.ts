import { z } from 'zod';
export declare const BooleanLookup: {
    readonly true: true;
    readonly false: false;
};
export declare const environmentVariableBooleanLookup: {
    readonly '1': true;
    readonly '0': false;
    readonly true: true;
    readonly false: false;
};
export declare const stripeDashPrefix: (flagNameInput: string) => string;
export declare const zodPassthrough: <T>() => z.ZodEffects<z.ZodAny, T, any>;
export type Values<T> = T[keyof T];
export declare const getLowerCaseEnvironment: () => NodeJS.ProcessEnv;
export declare const lowerCaseObjectKeys: (obj: object) => {
    [k: string]: any;
};
export declare const parseEnvironmentVariableBoolean: (value: string) => boolean | null;
export declare const parseEnvironmentVariableBooleanOrThrow: (value: string) => boolean;
export declare const negateNamePattern: RegExp;
export declare const stripeNegatePrefix: (name: string) => null | string;
export declare const stripeNegatePrefixLoose: (name: string) => string;
export declare const invertTable: <T>(rows: T[][]) => T[][];
export declare const entries: <O extends Record<string, unknown>>(obj: O) => Exclude<{ [k in keyof O]: [k, O[k]]; }[keyof O], undefined>[];
export declare const casesExhausted: (_: never) => never;
//# sourceMappingURL=helpers.d.ts.map