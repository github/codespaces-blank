export declare const isPromiseLikeValue: (value: unknown) => value is Promise<unknown>;
export type Index<T> = Record<string, T>;
export type RequireField<O extends object, F extends keyof O> = O & {
    [key in F]: Exclude<O[F], undefined | null>;
};
export declare const errorFromUnknown: (x: unknown) => Error;
export declare const dump: (...args: unknown[]) => void;
type Include<T, U> = T extends U ? T : never;
export declare const partition: <Item>(list: Item[], partitioner: (item: Item) => boolean) => [Item[], Item[]];
export declare function groupBy<Item extends object, Key extends string>(items: Item[], keyer: (item: Item) => Key): string extends Key ? Record<string, Item[]> : {
    [k in Key]?: Item[];
};
export declare function groupBy<Item extends object, Key extends keyof Item>(items: Item[], key: Key): {
    [k in Item[Key] & string]?: Include<Item, {
        [_ in Key]: k;
    }>[];
};
export type RenameKey<Obj, Old extends keyof Obj, New extends string> = {
    [Key in keyof Obj as Key extends Old ? New : Key]: Obj[Key];
};
export {};
//# sourceMappingURL=prelude.d.ts.map