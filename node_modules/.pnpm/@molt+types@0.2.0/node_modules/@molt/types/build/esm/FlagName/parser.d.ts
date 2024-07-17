import type { Str } from '../prelude.js';
import type { FlagNames, FlagNamesEmpty } from './data.js';
import type { String } from 'ts-toolbelt';
export declare namespace Checks {
    type LongFlagTooShort<Name extends string> = String.Length<Name> extends 1 ? true : false;
    type ShortFlagTooLong<Name extends string> = String.Length<Name> extends 1 ? false : true;
    type AliasDuplicate<Names extends FlagNames, Name extends string> = Str.KebabToCamelCase<Name> extends Names['long'] | Names['short'] ? true : false;
    type NameAlreadyTaken<Limits extends SomeLimits, Name extends string> = Limits['usedNames'] extends undefined ? false : Str.KebabToCamelCase<Name> extends Str.KebabToCamelCase<Exclude<Limits['usedNames'], undefined>> ? true : false;
    type NameReserved<Limits extends SomeLimits, Name extends string> = Limits['reservedNames'] extends undefined ? false : Str.KebabToCamelCase<Name> extends Str.KebabToCamelCase<Exclude<Limits['reservedNames'], undefined>> ? true : false;
}
export declare namespace Errors {
    type $Is<T> = T extends string ? Str.StartsWith<'Error: ', T> : false;
    type LongFlagTooShort<Given extends string> = `Error: A long flag must be two (2) or more characters but you have: '--${Given}'.`;
    type ShortFlagTooLong<Given extends string> = `Error: A short flag must be exactly one (1) character but you have: '-${Given}'.`;
    type TrailingPipe = `Error: You have a trailing pipe. Pipes are for adding aliases. Add more names after your pipe or remove it.`;
    type Empty = `Error: You must specify at least one name for your flag.`;
    type Unknown = `Error: Cannot parse your flag expression.`;
    type AliasDuplicate<Name extends string> = `Error: Your alias "${Name}" is a duplicate.`;
    type NameAlreadyTaken<Name extends string> = `Error: The name "${Name}" cannot be used because it is already used for another flag.`;
    type NameReserved<Name extends string> = `Error: The name "${Name}" cannot be used because it is reserved.`;
}
export declare type BaseFlagNameChecks<name extends string, limits extends SomeLimits, names extends FlagNames> = Checks.AliasDuplicate<names, name> extends true ? Errors.AliasDuplicate<name> : Checks.NameAlreadyTaken<limits, name> extends true ? Errors.NameAlreadyTaken<name> : Checks.NameReserved<limits, name> extends true ? Errors.NameReserved<name> : null;
export declare type DashPrefixedLongFlagNameChecks<name extends string, limits extends SomeLimits, names extends FlagNames> = Errors.$Is<BaseFlagNameChecks<name, limits, names>> extends true ? BaseFlagNameChecks<name, limits, names> : Checks.LongFlagTooShort<name> extends true ? Errors.LongFlagTooShort<name> : null;
export declare type DashPrefixedShortFlagNameChecks<name extends string, limits extends SomeLimits, names extends FlagNames> = Errors.$Is<BaseFlagNameChecks<name, limits, names>> extends true ? BaseFlagNameChecks<name, limits, names> : Checks.ShortFlagTooLong<name> extends true ? Errors.ShortFlagTooLong<name> : null;
declare type AddAliasLong<Names extends FlagNames, Name extends string> = Omit<Names, 'aliases'> & {
    aliases: {
        long: [...Names['aliases']['long'], Str.KebabToCamelCase<Name>];
        short: Names['aliases']['short'];
    };
};
declare type AddAliasShort<Names extends FlagNames, Name extends string> = Omit<Names, 'aliases'> & {
    aliases: {
        long: Names['aliases']['long'];
        short: [...Names['aliases']['short'], Name];
    };
};
declare type AddLong<Names extends FlagNames, Name extends string> = Omit<Names, 'long'> & {
    long: Str.KebabToCamelCase<Name>;
};
declare type AddShort<Names extends FlagNames, Name extends string> = Omit<Names, 'short'> & {
    short: Name;
};
declare type SomeLimits = {
    reservedNames: string | undefined;
    usedNames: string | undefined;
};
declare type SomeLimitsNone = {
    reservedNames: undefined;
    usedNames: undefined;
};
export declare type Parse<E extends string, limits extends SomeLimits = SomeLimitsNone, names extends FlagNames = FlagNamesEmpty> = ParseFlagNameDo<E, limits, names>;
declare type ParseFlagNameDo<E extends string, limits extends SomeLimits, names extends FlagNames> = E extends `` ? FlagNamesEmpty extends names ? Errors.Empty : names : E extends ` ${infer tail}` ? ParseFlagNameDo<tail, limits, names> : E extends `${infer initial} ` ? ParseFlagNameDo<initial, limits, names> : E extends `--${infer name} ${infer tail}` ? Errors.$Is<DashPrefixedLongFlagNameChecks<name, limits, names>> extends true ? DashPrefixedLongFlagNameChecks<name, limits, names> : names['long'] extends undefined ? ParseFlagNameDo<tail, limits, AddLong<names, name>> : ParseFlagNameDo<tail, limits, AddAliasLong<names, name>> : E extends `--${infer name}` ? Errors.$Is<DashPrefixedLongFlagNameChecks<name, limits, names>> extends true ? DashPrefixedLongFlagNameChecks<name, limits, names> : names['long'] extends undefined ? AddLong<names, name> : AddAliasLong<names, name> : E extends `-${infer name} ${infer tail}` ? Errors.$Is<DashPrefixedShortFlagNameChecks<name, limits, names>> extends true ? DashPrefixedShortFlagNameChecks<name, limits, names> : names['short'] extends undefined ? ParseFlagNameDo<tail, limits, AddShort<names, name>> : ParseFlagNameDo<tail, limits, AddAliasShort<names, name>> : E extends `-${infer name}` ? Errors.$Is<DashPrefixedShortFlagNameChecks<name, limits, names>> extends true ? DashPrefixedShortFlagNameChecks<name, limits, names> : names['short'] extends undefined ? AddShort<names, name> : AddAliasShort<names, name> : E extends `${infer name} ${infer tail}` ? Errors.$Is<BaseFlagNameChecks<name, limits, names>> extends true ? DashPrefixedLongFlagNameChecks<name, limits, names> : String.Length<name> extends 1 ? names['short'] extends undefined ? ParseFlagNameDo<tail, limits, AddShort<names, name>> : ParseFlagNameDo<tail, limits, AddAliasShort<names, name>> : names['long'] extends undefined ? ParseFlagNameDo<tail, limits, AddLong<names, name>> : ParseFlagNameDo<tail, limits, AddAliasLong<names, name>> : E extends `${infer name}` ? Errors.$Is<BaseFlagNameChecks<name, limits, names>> extends true ? DashPrefixedShortFlagNameChecks<name, limits, names> : String.Length<name> extends 1 ? names['short'] extends undefined ? AddShort<names, name> : AddAliasShort<names, name> : names['long'] extends undefined ? AddLong<names, name> : AddAliasLong<names, name> : Errors.Unknown;
export {};
//# sourceMappingURL=parser.d.ts.map