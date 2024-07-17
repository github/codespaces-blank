import type { ExecutionResult, GraphQLSchema } from 'graphql';
import type { BaseInput } from './types.js';
interface Input extends BaseInput {
    schema: GraphQLSchema;
}
export declare const execute: (input: Input) => Promise<ExecutionResult>;
export {};
//# sourceMappingURL=execute.d.ts.map