import type { StandardScalarRuntimeTypes } from './Scalar.js';
export declare const codec: <Decoded = any, Encoded extends StandardScalarRuntimeTypes = StandardScalarRuntimeTypes>(codec: Codec<Decoded, Encoded>) => Codec<Decoded, Encoded>;
export type Codec<Decoded = any, Encoded extends StandardScalarRuntimeTypes = StandardScalarRuntimeTypes> = {
    encode: (value: Decoded) => Encoded;
    decode: (value: Encoded) => Decoded;
};
//# sourceMappingURL=codec.d.ts.map