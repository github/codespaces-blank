/* eslint-disable @typescript-eslint/ban-types */
import { nativeScalarCodecs } from './nativeScalarCodecs.js';
export { nativeScalarCodecs } from './nativeScalarCodecs.js';
export const ScalarKind = `Scalar`;
export const scalar = (name, codec) => ({
    kind: ScalarKind,
    name: name,
    codec: codec, // eslint-disable-line
});
export const String = scalar(`String`, nativeScalarCodecs.String);
export const ID = scalar(`ID`, nativeScalarCodecs.String);
export const Int = scalar(`Int`, nativeScalarCodecs.Number);
export const Float = scalar(`Float`, nativeScalarCodecs.Number);
export const Boolean = scalar(`Boolean`, nativeScalarCodecs.Boolean);
export const Scalars = {
    String,
    ID,
    Int,
    Float,
    Boolean,
};
//# sourceMappingURL=Scalar.js.map