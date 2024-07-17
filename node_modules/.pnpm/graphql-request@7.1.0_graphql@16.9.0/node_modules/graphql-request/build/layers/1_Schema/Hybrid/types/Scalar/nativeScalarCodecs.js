import { codec } from './codec.js';
export const nativeScalarCodecs = {
    String: codec({
        encode: (value) => value,
        decode: (value) => value,
    }),
    Number: codec({
        encode: (value) => value,
        decode: (value) => value,
    }),
    Boolean: codec({
        encode: (value) => value,
        decode: (value) => value,
    }),
};
//# sourceMappingURL=nativeScalarCodecs.js.map