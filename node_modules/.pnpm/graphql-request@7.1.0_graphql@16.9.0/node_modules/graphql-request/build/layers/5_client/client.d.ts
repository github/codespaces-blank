import { type ExecutionResult, GraphQLSchema } from 'graphql';
import type { Anyware } from '../../lib/anyware/__.js';
import type { SomeExecutionResultWithoutErrors } from '../../lib/graphql.js';
import type { URLInput } from '../0_functions/request.js';
import type { BaseInput } from '../0_functions/types.js';
import { Schema } from '../1_Schema/__.js';
import type { GlobalRegistry } from '../2_generator/globalRegistry.js';
import { Core } from '../5_core/__.js';
import type { ApplyInputDefaults, Config, ReturnModeTypeBase, ReturnModeTypeSuccessData } from './Config.js';
import type { DocumentFn } from './document.js';
import type { GetRootTypeMethods } from './RootTypeMethods.js';
export type SchemaInput = URLInput | GraphQLSchema;
export interface RawInput extends BaseInput {
    schema: SchemaInput;
}
export type SelectionSetOrIndicator = 0 | 1 | boolean | object;
export type SelectionSetOrArgs = object;
export interface Context {
    retry: undefined | Anyware.Extension2<Core.Core, {
        retrying: true;
    }>;
    extensions: Anyware.Extension2<Core.Core>[];
    config: Config;
}
export type TypedContext = Context & {
    schemaIndex: Schema.Index;
};
export type ClientRaw<_$Config extends Config> = {
    raw: (input: Omit<RawInput, 'schema'>) => Promise<ExecutionResult>;
    rawOrThrow: (input: Omit<RawInput, 'schema'>) => Promise<SomeExecutionResultWithoutErrors>;
};
export type Client<$Index extends Schema.Index | null, $Config extends Config> = ClientRaw<$Config> & ($Index extends Schema.Index ? ClientTyped<$Index, $Config> : {}) & {
    extend: (extension: Anyware.Extension2<Core.Core>) => Client<$Index, $Config>;
    retry: (extension: Anyware.Extension2<Core.Core, {
        retrying: true;
    }>) => Client<$Index, $Config>;
};
export type ClientTyped<$Index extends Schema.Index, $Config extends Config> = {
    document: DocumentFn<$Config, $Index>;
} & GetRootTypeMethods<$Config, $Index>;
export type InputRaw = {
    schema: SchemaInput;
    headers?: HeadersInit;
};
export type InputPrefilled<$Schema extends GlobalRegistry.SchemaList> = $Schema extends any ? {
    returnMode?: ReturnModeTypeBase | (GlobalRegistry.HasSchemaErrors<$Schema> extends true ? ReturnModeTypeSuccessData : never);
} & InputRaw : never;
export type CreatePrefilled = <$Name extends GlobalRegistry.SchemaNames>(name: $Name, schemaIndex: Schema.Index) => <$Input extends InputPrefilled<GlobalRegistry.Schemas[$Name]>>(input: $Input) => Client<GlobalRegistry.GetSchemaIndexOrDefault<$Name>, ApplyInputDefaults<{
    returnMode: $Input['returnMode'];
}>>;
export declare const createPrefilled: CreatePrefilled;
export type Input<$Schema extends GlobalRegistry.SchemaList> = {
    /**
     * Used internally.
     *
     * When custom scalars are being used, this runtime schema is used to
     * encode/decode them before/after your application sends/receives them.
     *
     * When using root type field methods, this runtime schema is used to assist how arguments on scalars versus objects
     * are constructed into the sent GraphQL document.
     */
    readonly schemaIndex?: Schema.Index | null;
    /**
     * The schema to use.
     *
     * TODO why don't we infer this from the runtime schemaIndex?
     *
     * @defaultValue 'default'
     */
    name?: $Schema['index']['name'];
} & InputPrefilled<$Schema>;
type Create = <$Input extends Input<GlobalRegistry.SchemaList>>(input: $Input) => Client<$Input['schemaIndex'] extends Schema.Index ? GlobalRegistry.GetSchemaIndexOrDefault<$Input['name']> : null, ApplyInputDefaults<{
    returnMode: $Input['returnMode'];
}>>;
export declare const create: Create;
interface CreateState {
    retry?: Anyware.Extension2<Core.Core, {
        retrying: true;
    }>;
    extensions: Anyware.Extension2<Core.Core>[];
}
export declare const createInternal: (input_: Input<any>, state: CreateState) => any;
export {};
//# sourceMappingURL=client.d.ts.map