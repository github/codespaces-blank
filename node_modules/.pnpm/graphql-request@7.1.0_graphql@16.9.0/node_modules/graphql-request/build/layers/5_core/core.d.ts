import type { DocumentNode, ExecutionResult, GraphQLSchema } from 'graphql';
import { Anyware } from '../../lib/anyware/__.js';
import { type StandardScalarVariables } from '../../lib/graphql.js';
import type { Schema } from '../1_Schema/__.js';
import type { GraphQLObjectSelection } from '../3_SelectionSet/encode.js';
import type { ContextInterfaceRaw, ContextInterfaceTyped, InterfaceRaw, InterfaceTyped, TransportHttp, TransportMemory } from './types.js';
type InterfaceInput<A = {}, B = {}> = ({
    interface: InterfaceTyped;
    context: ContextInterfaceTyped;
    rootTypeName: Schema.RootTypeName;
} & A) | ({
    interface: InterfaceRaw;
    context: ContextInterfaceRaw;
} & B);
type TransportInput<A = {}, B = {}> = ({
    transport: TransportHttp;
} & A) | ({
    transport: TransportMemory;
} & B);
export declare const hookNamesOrderedBySequence: readonly ["encode", "pack", "exchange", "unpack", "decode"];
export type HookSequence = typeof hookNamesOrderedBySequence;
export type HookInputEncode = InterfaceInput<{
    selection: GraphQLObjectSelection;
}, {
    document: string | DocumentNode;
}> & TransportInput<{
    schema: string | URL;
}, {
    schema: GraphQLSchema;
}>;
export type HookInputPack = {
    document: string | DocumentNode;
    variables: StandardScalarVariables;
    operationName?: string;
} & InterfaceInput & TransportInput<{
    url: string | URL;
    headers?: HeadersInit;
}, {
    schema: GraphQLSchema;
}>;
export type ExchangeInputHook = InterfaceInput & TransportInput<{
    request: Request;
}, {
    schema: GraphQLSchema;
    document: string | DocumentNode;
    variables: StandardScalarVariables;
    operationName?: string;
}>;
export type HookInputUnpack = InterfaceInput & TransportInput<{
    response: Response;
}, {
    result: ExecutionResult;
}>;
export type HookInputDecode = {
    result: ExecutionResult;
} & InterfaceInput;
export type Hooks = {
    encode: HookInputEncode;
    pack: HookInputPack;
    exchange: ExchangeInputHook;
    unpack: HookInputUnpack;
    decode: HookInputDecode;
};
export declare const anyware: Anyware.Builder<Anyware.Core<readonly ["encode", "pack", "exchange", "unpack", "decode"], Hooks, ExecutionResult<import("graphql/jsutils/ObjMap.js").ObjMap<unknown>, import("graphql/jsutils/ObjMap.js").ObjMap<unknown>>>>;
export type Core = (typeof anyware)['core'];
export {};
//# sourceMappingURL=core.d.ts.map