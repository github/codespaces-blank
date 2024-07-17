import type { IsNotFalse, IsPrimitive } from "./internal";
import type { IsNever } from "./is-never";
import type { Numeric } from "./numeric";
import type { Primitive } from "./primitive";
type LiteralCheck<T, LiteralType extends Primitive> = IsNever<T> extends false ? [T] extends [LiteralType] ? [LiteralType] extends [T] ? false : true : false : false;
type LiteralChecks<T, LiteralUnionType> = IsNotFalse<LiteralUnionType extends Primitive ? LiteralCheck<T, LiteralUnionType> : never>;
export type IsStringLiteral<T> = LiteralCheck<T, string>;
export type IsNumericLiteral<T> = LiteralChecks<T, Numeric>;
export type IsBooleanLiteral<T> = LiteralCheck<T, boolean>;
export type IsSymbolLiteral<T> = LiteralCheck<T, symbol>;
type IsLiteralUnion<T> = IsBooleanLiteral<T> | IsNumericLiteral<T> | IsStringLiteral<T> | IsSymbolLiteral<T>;
export type IsLiteral<T> = IsPrimitive<T> extends true ? IsNotFalse<IsLiteralUnion<T>> : false;
export {};
//# sourceMappingURL=is-literal.d.ts.map