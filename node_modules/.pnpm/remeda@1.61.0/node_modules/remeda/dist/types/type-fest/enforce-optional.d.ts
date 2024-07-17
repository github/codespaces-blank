import type { Simplify } from "./simplify";
type RequiredFilter<Type, Key extends keyof Type> = undefined extends Type[Key] ? Type[Key] extends undefined ? Key : never : Key;
type OptionalFilter<Type, Key extends keyof Type> = undefined extends Type[Key] ? Type[Key] extends undefined ? never : Key : never;
export type EnforceOptional<ObjectType> = Simplify<{
    [Key in keyof ObjectType as OptionalFilter<ObjectType, Key>]?: Exclude<ObjectType[Key], undefined>;
} & {
    [Key in keyof ObjectType as RequiredFilter<ObjectType, Key>]: ObjectType[Key];
}>;
export {};
//# sourceMappingURL=enforce-optional.d.ts.map