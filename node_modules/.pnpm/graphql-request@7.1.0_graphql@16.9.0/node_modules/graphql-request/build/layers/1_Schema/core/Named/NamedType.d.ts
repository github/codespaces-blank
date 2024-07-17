import type { Digit, Letter } from '../../../../lib/prelude.js';
/**
 * @see http://spec.graphql.org/draft/#sec-Names
 */
export type NameParse<S extends string> = S extends NameHead ? S : S extends `${NameHead}${infer Rest}` ? NameBodyParse<Rest> extends never ? never : S : never;
type NameBodyParse<S extends string> = S extends NameBody ? S : S extends `${NameBody}${infer Rest}` ? NameBodyParse<Rest> extends never ? never : S : never;
export type NameHead = Letter | '_';
export type NameBody = Letter | '_' | Digit;
export {};
//# sourceMappingURL=NamedType.d.ts.map