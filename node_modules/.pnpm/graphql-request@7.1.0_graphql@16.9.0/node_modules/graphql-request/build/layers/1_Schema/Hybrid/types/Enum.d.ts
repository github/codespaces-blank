export interface Enum<$Name extends string = string, $Members extends [string, ...string[]] = [string, ...string[]]> {
    kind: 'Enum';
    name: $Name;
    members: $Members;
}
export declare const Enum: <$Name extends string, $Members extends [string, ...string[]]>(name: $Name, members: $Members) => Enum<$Name, $Members>;
//# sourceMappingURL=Enum.d.ts.map