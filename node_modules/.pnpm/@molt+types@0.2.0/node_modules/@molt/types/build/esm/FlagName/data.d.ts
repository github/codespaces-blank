export declare type SomeParseError = string;
export declare type SomeParseResult = SomeParseError | FlagNames;
export declare type FlagName = {
    long: string | undefined;
    short: string | undefined;
};
export declare type FlagNames = FlagName & {
    aliases: {
        short: [...string[]];
        long: [...string[]];
    };
};
export declare type FlagNamesEmpty = {
    aliases: {
        short: [];
        long: [];
    };
    long: undefined;
    short: undefined;
};
/**
 * Get the canonical name of the flag. If there is a long name, it will be used. Otherwise, the short name will be used.
 */
export declare type GetCanonicalName<Names extends FlagNames> = Names['long'] extends string ? Names['long'] : Names['short'] extends string ? Names['short'] : never;
/**
 * Get the names of the flag from a successful parse result. If the parse result was a failure then an empty string is returned.
 */
export declare type GetNamesFromParseResult<Names extends SomeParseResult> = Names extends FlagNames ? ((Names['long'] extends undefined ? never : Names['long']) | (Names['short'] extends undefined ? never : Names['short']) | Names['aliases']['long'][number] | Names['aliases']['short'][number]) : '';
/**
 * Get the canonical name of the flag from a successful parse result, or, if parsing failed, the error message.
 */
export declare type GetCanonicalNameOrErrorFromParseResult<result extends SomeParseResult> = result extends string ? result : result extends FlagNames ? GetCanonicalName<result> : never;
//# sourceMappingURL=data.d.ts.map