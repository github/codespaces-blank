import type { Index } from './Index.js';
export type MaybeThunk<$Type> = $Type | Thunk<$Type>;
export type Thunk<$Type> = () => $Type;
export declare const readMaybeThunk: <T>(maybeThunk: MaybeThunk<T>) => T;
export declare namespace Base {
    interface Nullable<$Type> {
        kind: 'nullable';
        type: $Type;
    }
    interface List<$Type> {
        kind: 'list';
        type: $Type;
    }
}
export type RootTypeName = keyof Index['Root'];
//# sourceMappingURL=helpers.d.ts.map