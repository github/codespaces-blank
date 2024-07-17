export declare namespace Code {
    const propertyAccess: (object: string, name: string) => string;
    const quote: (str: string) => string;
    const nullable: (type: string) => string;
    const union: (name: string, types: string[]) => string;
    const unionItems: (types: string[]) => string;
    const tuple: (types: string[]) => string;
    const list: (type: string) => string;
    const field: (name: string, type: string, options?: {
        optional?: boolean;
    }) => string;
    const optionalField: (name: string, type: string) => string;
    const fields: (fieldTypes: string[]) => string;
    const intersection: (a: string, b: string) => string;
    const object: (fields: string) => string;
    const objectFromEntries: (entries: [string, string][]) => string;
    const objectFrom: (object: Record<string, null | string | boolean | number | {
        type: null | string | boolean | number;
        optional?: boolean;
        tsdoc?: string;
    }>) => string;
    const type: (name: string, type: string) => string;
    const interface$: (name: string, object: string) => string;
    const export$: (thing: string) => string;
    const TSDoc: (content: string | null, block: string) => string;
    const namespace: (name: string, content: string) => string;
    const group: (...content: string[]) => string;
    const commentSectionTitle: (title: string) => string;
}
//# sourceMappingURL=Code.d.ts.map