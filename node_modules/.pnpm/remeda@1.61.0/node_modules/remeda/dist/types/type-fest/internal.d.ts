import type { IsNever } from "./is-never";
import type { Primitive } from "./primitive";
export type IsNotFalse<T extends boolean> = [T] extends [false] ? false : true;
export type IsPrimitive<T> = [T] extends [Primitive] ? true : false;
export type IsUnion<T> = InternalIsUnion<T>;
type InternalIsUnion<T, U = T> = (IsNever<T> extends true ? false : T extends any ? [U] extends [T] ? false : true : never) extends infer Result ? boolean extends Result ? true : Result : never;
export {};
//# sourceMappingURL=internal.d.ts.map