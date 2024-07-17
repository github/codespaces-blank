import type { SomeSchema } from '../../core/internal.js';
import type { InputBase } from '../../core/types.js';
import type { SomeDefaults } from './builder.js';
import type { SomeRecordController } from './controller.js';
import type { z } from 'zod';
export type SomeRecordConstructorInput = Record<string, unknown>;
export type SomeDecoderDefinition = (encodedData: string, extensions: {
    schema: SomeSchema;
    name: string;
    [key: string]: unknown;
}) => null | SomeRecordConstructorInput;
export type SomeCodecDefinition = {
    to: SomeEncoderDefinition;
    from: SomeDecoderDefinition;
};
export type SomeEncoderDefinition = (record: SomeRecordController) => string;
export type SomeDefaultsProvider<PotentialInput extends InputBase = InputBase, Defaults extends SomeDefaults = SomeDefaults> = (potentialInput: PotentialInput) => Defaults;
export type SomeEncoder = (value: any, context: {
    schema: z.ZodSchema;
}) => string;
export type SomeEncoderJson = (value: any) => string;
export type SomeDecoder = (encodedData: string) => null | object;
export type SomeDecoderJson = (encodedData: string) => null | object;
export type SomeDecodeOrThrower = (encodedData: string) => object;
export type SomeDecodeOrThrowJson = (encodedData: string) => object;
export interface SomeRecordBuilder {
    schema: object;
    extend: object;
    codec: object;
    defaults: (defaults: SomeDefaultsProvider) => object;
    done: () => object;
    _?: {
        innerChain: SomeRecordBuilder;
    };
}
//# sourceMappingURL=internal.d.ts.map