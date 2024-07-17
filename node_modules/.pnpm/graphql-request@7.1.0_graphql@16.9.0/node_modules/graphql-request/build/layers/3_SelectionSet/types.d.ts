import type { MaybeList, StringNonEmpty, Values } from '../../lib/prelude.js';
import type { TSError } from '../../lib/TSError.js';
import type { InputFieldsAllNullable, OmitNullableFields, PickNullableFields, Schema, SomeField, SomeFields } from '../1_Schema/__.js';
export type Query<$Index extends Schema.Index> = Root<$Index, 'Query'>;
export type Mutation<$Index extends Schema.Index> = Root<$Index, 'Mutation'>;
export type Subscription<$Index extends Schema.Index> = Root<$Index, 'Subscription'>;
export type Root<$Index extends Schema.Index, Type extends keyof Schema.Index['Root']> = $Index['Root'][Type] extends Schema.Object$2 ? Object<$Index['Root'][Type], $Index> : never;
export type Object<$Object extends Schema.Object$2, $Index extends Schema.Index> = Fields<$Object['fields'], $Index>;
type Fields<$Fields extends SomeFields, $Index extends Schema.Index> = {
    [Key in keyof $Fields]?: Field<$Fields[Key], $Index>;
} & 
/**
 * Alias support.
 * Allow every field to also be given as a key with this pattern `<field>_as_<alias>: ...`
 */
{
    [Key in keyof $Fields as `${keyof $Fields & string}_as_${StringNonEmpty}`]?: Field<$Fields[Key], $Index>;
} & 
/**
 * Inline fragments for field groups.
 * @see https://spec.graphql.org/draft/#sec-Inline-Fragments
 */
{
    ___?: MaybeList<Fields<$Fields, $Index> & FieldDirectives>;
} & 
/**
 * Special property to select all scalars.
 */
{
    $scalars?: ClientIndicator;
};
export type IsSelectScalarsWildcard<SS> = SS extends {
    $scalars: ClientIndicatorPositive;
} ? true : false;
type FieldOptions = {
    /**
     * When using root type field methods there is no point in directives since there can be
     * no no peer fields with those function that by design target sending one root type field.
     */
    hideDirectives?: boolean;
};
type FieldOptionsDefault = {
    hideDirectives: false;
};
export type Field<$Field extends SomeField, $Index extends Schema.Index, $Options extends FieldOptions = FieldOptionsDefault> = Field_<$Field['type'], $Field, $Index, $Options>;
export type Field_<$type extends Schema.Output.Any, $Field extends SomeField, $Index extends Schema.Index, $Options extends FieldOptions> = $type extends Schema.Output.Nullable<infer $typeInner> ? Field_<$typeInner, $Field, $Index, $Options> : $type extends Schema.Output.List<infer $typeInner> ? Field_<$typeInner, $Field, $Index, $Options> : $type extends Schema.__typename ? NoArgsIndicator : $type extends Schema.Scalar.Any ? Indicator<$Field> : $type extends Schema.Enum ? Indicator<$Field> : $type extends Schema.Object$2 ? Object<$type, $Index> & ($Options['hideDirectives'] extends true ? {} : FieldDirectives) & Arguments<$Field> : $type extends Schema.Union ? Union<$type, $Index> & Arguments<$Field> : $type extends Schema.Interface ? Interface<$type, $Index> & Arguments<$Field> : TSError<'Field', '$Field case not handled', {
    $Field: $Field;
}>;
type Arguments<$Field extends SomeField> = $Field['args'] extends Schema.Args<any> ? InputFieldsAllNullable<$Field['args']['fields']> extends true ? {
    $?: Args<$Field['args']>;
} : {
    $: Args<$Field['args']>;
} : {};
export type Interface<$Node extends Schema.Interface, $Index extends Schema.Index> = InterfaceDistributed<$Node['implementors'][number], $Index> & Fields<$Node['fields'] & {
    __typename: $Node['implementors'][number]['fields']['__typename'];
}, $Index>;
type InterfaceDistributed<$Node extends Schema.Object$2, $Index extends Schema.Index> = $Node extends any ? {
    [$typename in $Node['fields']['__typename']['type']['type'] as `on${Capitalize<$typename>}`]?: Object<$Node, $Index> & FieldDirectives;
} : never;
export type Union<$Node extends Schema.Union, $Index extends Schema.Index> = UnionDistributed<$Node['members'][number], $Index> & {
    __typename?: NoArgsIndicator;
};
type UnionDistributed<$Object extends Schema.Object$2, $Index extends Schema.Index> = $Object extends any ? {
    [$typename in $Object['fields']['__typename']['type']['type'] as `on${Capitalize<$typename>}`]?: Object<$Object, $Index> & FieldDirectives;
} : never;
/**
 * Helpers
 * ---------------------------------------------------------------------------------------------------
 */
/**
 * Unions
 */
export type UnionFragmentExtractName<T> = T extends `on${infer $Name}` ? $Name : never;
export type UnionExtractFragmentNames<T> = Values<{
    [Key in keyof T]: UnionFragmentExtractName<Key>;
}>;
export type OmitOnTypeFragments<T> = {
    [$K in keyof T as $K extends `on${StringNonEmpty}` ? never : $K]: T[$K];
};
/**
 * Aliases
 */
export interface Alias<O extends string = string, T extends string = string> {
    origin: O;
    target: T;
}
export type ParseAliasExpression<E> = E extends `${infer O}_as_${infer T}` ? Schema.Named.NameParse<O> extends never ? E : Schema.Named.NameParse<T> extends never ? E : Alias<O, T> : E;
export type AliasNameOrigin<N> = ParseAliasExpression<N> extends Alias<infer O, any> ? O : N;
/**
 * Resolve the target of an alias or if is not an alias just pass through the name.
 */
export type AliasNameTarget<N> = ParseAliasExpression<N> extends Alias<any, infer T> ? T : N;
export type ResolveAliasTargets<SelectionSet> = {
    [Field in keyof SelectionSet as AliasNameTarget<Field>]: SelectionSet[Field];
};
/**
 * Directives
 */
export declare namespace Directive {
    type Include = {
        $include: boolean | {
            if?: boolean;
        };
    };
    namespace Include {
        type Positive = {
            $include: true | {
                if: true;
            };
        };
        type Negative = {
            $include: false | {
                if: false;
            };
        };
    }
    type Skip = {
        $skip: boolean | {
            if?: boolean;
        };
    };
    namespace Skip {
        type Positive = {
            $skip: true | {
                if: true;
            };
        };
        type Negative = {
            $skip: false | {
                if: false;
            };
        };
    }
    type Defer = {
        $defer: boolean | {
            if?: boolean;
            label?: string;
        };
    };
    namespace Defer {
        type Positive = {
            $defer: true | {
                if: true;
            };
        };
        type Negative = {
            $defer: false | {
                if: false;
            };
        };
    }
    type Stream = {
        $stream: boolean | {
            if?: boolean;
            label?: string;
            initialCount?: number;
        };
    };
    namespace Stream {
        type Positive = {
            $stream: true | {
                if: true;
            };
        };
        type Negative = {
            $stream: false | {
                if: false;
            };
        };
    }
}
/**
 * Indicators
 */
/**
 * Should this field be selected?
 */
export type ClientIndicator = ClientIndicatorPositive | ClientIndicatorNegative;
export type ClientIndicatorPositive = true | 1;
export type ClientIndicatorNegative = false | 0 | undefined;
export type OmitNegativeIndicators<$SelectionSet> = {
    [K in keyof $SelectionSet as $SelectionSet[K] extends ClientIndicatorNegative ? never : K]: $SelectionSet[K];
};
/**
 * Field selection in general, with directives support too.
 * If a field directive is given as an indicator then it implies "select this" e.g. `true`/`1`.
 * Of course the semantics of the directive may change the derived type (e.g. `skip` means the field might not show up in the result set)
 */
export type NoArgsIndicator = ClientIndicator | FieldDirectives;
export type Indicator<$Field extends SomeField> = $Field['args'] extends Schema.Args<any> ? InputFieldsAllNullable<$Field['args']['fields']> extends true ? ({
    $?: Args<$Field['args']>;
} & FieldDirectives) | ClientIndicator : {
    $: Args<$Field['args']>;
} & FieldDirectives : NoArgsIndicator;
export type Args<$Args extends Schema.Args<any>> = ArgFields<$Args['fields']>;
export type ArgFields<$ArgFields extends Schema.InputObject['fields']> = {
    [Key in keyof OmitNullableFields<$ArgFields>]: InputField<$ArgFields[Key]>;
} & {
    [Key in keyof PickNullableFields<$ArgFields>]?: InputField<$ArgFields[Key]> | null;
};
type InputField<$InputType extends Schema.Input.Any> = $InputType extends Schema.Input.Nullable<infer $InnerType> ? InputField<$InnerType> | null : $InputType extends Schema.Input.List<infer $InnerType> ? InputField<$InnerType>[] : $InputType extends Schema.InputObject<infer _, infer $Fields> ? ArgFields<$Fields> : $InputType extends Schema.Enum<infer _, infer $Members> ? $Members[number] : $InputType extends Schema.Scalar.Any ? ReturnType<$InputType['codec']['decode']> : TSError<'InferTypeInput', 'Unknown $InputType', {
    $InputType: $InputType;
}>;
/**
 * @see https://spec.graphql.org/draft/#sec-Type-System.Directives.Built-in-Directives
 */
export interface FieldDirectives {
    /**
     * https://spec.graphql.org/draft/#sec--skip
     */
    $skip?: boolean | {
        if?: boolean;
    };
    /**
     * https://spec.graphql.org/draft/#sec--include
     */
    $include?: boolean | {
        if?: boolean;
    };
    /**
     * @see https://github.com/graphql/graphql-wg/blob/main/rfcs/DeferStream.md#defer
     */
    $defer?: boolean | {
        if?: boolean;
        label?: string;
    };
    /**
     * @see https://github.com/graphql/graphql-wg/blob/main/rfcs/DeferStream.md#stream
     */
    $stream?: boolean | {
        if?: boolean;
        label?: string;
        initialCount?: number;
    };
}
export {};
//# sourceMappingURL=types.d.ts.map