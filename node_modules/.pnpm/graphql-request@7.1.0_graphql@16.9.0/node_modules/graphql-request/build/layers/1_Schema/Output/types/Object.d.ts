import type { Field, SomeFields } from '../../Field.js';
import type { Hybrid } from '../../Hybrid/__.js';
import type { UnwrapToNamed } from '../typeGroups.js';
import { __typename } from './__typename.js';
export interface Object$2<$Name extends string = string, $Fields extends SomeFields = SomeFields> {
    kind: 'Object';
    fields: {
        __typename: Field<__typename<$Name>, null>;
    } & $Fields;
}
export declare const Object$: <$Name extends string, $Fields extends Record<keyof $Fields, Field<any, any>>>(name: $Name, fields: $Fields) => Object$2<$Name, $Fields>;
export { Object$ as Object };
export type PickScalarFields<$Object extends Object$2> = {
    [$Key in keyof $Object['fields'] as UnwrapToNamed<$Object['fields'][$Key]['type']> extends Hybrid.Scalar.Any | __typename ? $Key : never]: $Object['fields'][$Key];
};
//# sourceMappingURL=Object.d.ts.map