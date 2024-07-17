export * from './zod.js';
export type ArgumentValueScalar = string | boolean | number;
export type ArgumentValueMutuallyExclusive = {
    _tag: string;
    value: ArgumentValueScalar;
};
export type ArgumentValue = undefined | ArgumentValueScalar | ArgumentValueMutuallyExclusive;
export type Type = TypeEnum | TypeString | TypeNumber | TypeBoolean | TypeLiteral;
export interface TypeLiteral {
    _tag: 'TypeLiteral';
    value: string | number | boolean;
}
export interface TypeBoolean {
    _tag: 'TypeBoolean';
}
export interface TypeEnum {
    _tag: 'TypeEnum';
    members: (number | string)[];
}
export interface TypeString {
    _tag: 'TypeString';
    transformations?: {
        trim?: boolean;
        toCase?: 'upper' | 'lower';
    };
    regex?: RegExp;
    min?: number;
    max?: number;
    length?: number;
    pattern?: {
        type: 'email';
    } | {
        type: 'url';
    } | {
        type: 'uuid';
    } | {
        type: 'cuid';
    } | {
        type: 'cuid2';
    } | {
        type: 'ulid';
    } | {
        type: 'emoji';
    } | {
        type: 'ip';
        /**
         * If `null` then either IPv4 or IPv6 is allowed.
         */
        version: 4 | 6 | null;
    } | {
        type: 'dateTime';
        offset: boolean;
        precision: null | number;
    };
    startsWith?: string;
    endsWith?: string;
    includes?: string;
}
export interface TypeNumber {
    _tag: 'TypeNumber';
    int?: boolean;
    min?: number;
    max?: number;
    multipleOf?: number;
    finite?: boolean;
}
//# sourceMappingURL=types.d.ts.map