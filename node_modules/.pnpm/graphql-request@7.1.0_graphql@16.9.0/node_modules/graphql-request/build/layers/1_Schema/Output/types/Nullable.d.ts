import type { Base, MaybeThunk } from '../../core/helpers.js';
import type { Named } from '../typeGroups.js';
import type { List } from './List.js';
type InnerType = Named | List<any>;
export type Nullable<$Type extends InnerType> = Base.Nullable<$Type>;
export declare const Nullable: <$Type extends InnerType>(type: MaybeThunk<$Type>) => Nullable<$Type>;
export {};
//# sourceMappingURL=Nullable.d.ts.map