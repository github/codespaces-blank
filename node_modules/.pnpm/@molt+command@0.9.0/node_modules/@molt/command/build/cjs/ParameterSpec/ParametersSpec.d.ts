export * from './input.js';
export * from './output.js';
export * from './processor/process.js';
export * from './transform.js';
export * from './types.js';
export * from './validate.js';
import type { Output } from './output.js';
import type { Type } from './types.js';
export declare const findByName: (name: string, specs: Output[]) => null | Output;
/**
 * Get all the names of a parameter in array form.
 */
export declare const getNames: (spec: Output) => [string, ...string[]];
type NameHit = {
    kind: 'long' | 'longAlias';
    /**
     * Was the given name in negated format? e.g. noFoo instead of foo
     */
    negated: boolean;
} | {
    kind: 'short' | 'shortAlias';
};
/**
 * Is one of the parameter's names the given name?
 */
export declare const hasName: (spec: Output, name: string) => null | NameHit;
export declare const isOrHasType: (spec: Output, typeTag: Type['_tag']) => boolean;
//# sourceMappingURL=ParametersSpec.d.ts.map