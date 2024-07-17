import type { ParameterSpec } from '../ParameterSpec/index.js';
import type { Value } from './types.js';
import { z } from 'zod';
export declare const stripeDashPrefix: (flagNameInput: string) => string;
export declare const zodPassthrough: <T>() => z.ZodEffects<z.ZodAny, T, any>;
export declare const parseRawInput: (name: string, rawValue: string, spec: ParameterSpec.Output) => Value;
/**
 * Is the environment variable input negated? Unlike line input the environment can be
 * namespaced so a bit more work is needed to parse out the name pattern.
 */
export declare const isEnvarNegated: (name: string, spec: ParameterSpec.Output) => boolean;
export declare const isNegated: (name: string) => boolean;
export declare const parseRawValue: (value: string, spec: ParameterSpec.Output) => null | boolean | number | string;
/**
 * Enums can be given a base type of numbers or strings. Examples:
 *
 * - number: `z.nativeEnum(\{ a: 1, b: 2\})`
 * - string: `z.enum(['a','b','c'])`
 *
 * It is not possible to have an enum that mixes numbers and strings.
 *
 * When we receive a raw value, we infer its base  type based on checking the type first member of the enum.
 */
export declare const parseEnum: (spec: ParameterSpec.TypeEnum, value: string) => string | number;
export declare const parseLiteral: (spec: ParameterSpec.TypeLiteral, value: string) => boolean | string | number;
//# sourceMappingURL=helpers.d.ts.map