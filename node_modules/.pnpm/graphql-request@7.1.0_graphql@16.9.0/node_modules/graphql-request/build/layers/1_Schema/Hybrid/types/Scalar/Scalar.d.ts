import type { GlobalRegistry } from '../../../../2_generator/globalRegistry.js';
import type { Codec } from './codec.js';
export { nativeScalarCodecs } from './nativeScalarCodecs.js';
export declare const ScalarKind = "Scalar";
export type ScalarKind = typeof ScalarKind;
export type StandardScalarRuntimeTypes = boolean | number | string;
export declare const scalar: <$Name extends string, $Codec extends Codec<any, any>>(name: $Name, codec: $Codec) => Scalar<$Name, $Codec>;
export interface Scalar<$Name extends string = string, $Codec extends Codec = Codec> {
    kind: ScalarKind;
    name: $Name;
    codec: $Codec;
}
export declare const String: Scalar<"String", Codec<string, string>>;
export declare const ID: Scalar<"ID", Codec<string, string>>;
export declare const Int: Scalar<"Int", Codec<number, number>>;
export declare const Float: Scalar<"Float", Codec<number, number>>;
export declare const Boolean: Scalar<"Boolean", Codec<boolean, boolean>>;
export type ID = typeof ID;
export type String = typeof String;
export type Int = typeof Int;
export type Boolean = typeof Boolean;
export type Float = typeof Float;
export declare const Scalars: {
    String: Scalar<"String", Codec<string, string>>;
    ID: Scalar<"ID", Codec<string, string>>;
    Int: Scalar<"Int", Codec<number, number>>;
    Float: Scalar<"Float", Codec<number, number>>;
    Boolean: Scalar<"Boolean", Codec<boolean, boolean>>;
};
export type Any = String | Int | Boolean | ID | Float | Values<GlobalRegistry.Schemas[keyof GlobalRegistry.Schemas]['customScalars']>;
type Values<T> = T extends any ? keyof T extends never ? never : T[keyof T] : never;
//# sourceMappingURL=Scalar.d.ts.map