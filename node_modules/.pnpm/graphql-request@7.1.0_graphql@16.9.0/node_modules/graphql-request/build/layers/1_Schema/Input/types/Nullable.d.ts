import type { Base, MaybeThunk } from '../../core/helpers.js';
import type { Any, Named } from '../typeGroups.js';
import type { List } from './List.js';
type InnerType = Named | List<any>;
export type Nullable<$InnerType extends InnerType> = Base.Nullable<$InnerType>;
export declare const Nullable: <$InnerType extends InnerType>(type: MaybeThunk<$InnerType>) => Nullable<$InnerType>;
type UnwrapNullable<$Type> = $Type extends Nullable<infer $innerType> ? UnwrapNullable<$innerType> : $Type;
export declare const unwrapNullable: <$Type extends Any>(type: $Type) => UnwrapNullable<$Type>;
export {};
//# sourceMappingURL=Nullable.d.ts.map