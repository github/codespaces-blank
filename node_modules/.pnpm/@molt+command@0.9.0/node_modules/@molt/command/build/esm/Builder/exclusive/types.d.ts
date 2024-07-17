import type { ParameterSpec } from '../../ParameterSpec/index.js';
import type { RawArgInputs } from '../root/types.js';
import type { State } from '../State.js';
import type { z } from 'zod';
export interface ExclusiveParameterConfiguration {
    schema: ParameterSpec.SomeExclusiveZodType;
}
interface Parameter<State extends State.Base, Label extends string> {
    <NameExpression extends string, Configuration extends ExclusiveParameterConfiguration>(name: State.ValidateNameExpression<State, NameExpression>, configuration: Configuration): BuilderExclusiveInitial<State.AddExclusiveParameter<State, Label, NameExpression, Configuration>, Label>;
    <NameExpression extends string, Schema extends ParameterSpec.SomeExclusiveZodType>(name: State.ValidateNameExpression<State, NameExpression>, schema: Schema): BuilderExclusiveInitial<State.AddExclusiveParameter<State, Label, NameExpression, {
        schema: Schema;
    }>, Label>;
}
/**
 * This property is present to support internal functions. It is not intended to be used by you.
 */
export type InternalState<State extends State.Base = State.Base> = {
    /**
     * Used for build time. Type inference functionality.
     */
    typeState: State;
    /**
     * Used for runtime.
     */
    input: ParameterSpec.Input.Exclusive;
};
export interface BuilderExclusiveInitial<State extends State.Base, Label extends string> {
    _: InternalState<State>;
    parameter: Parameter<State, Label>;
    optional: () => BuilderExclusiveAfterOptional<State.SetExclusiveOptional<State, Label, true>>;
    default: <Tag extends keyof State['ParametersExclusive'][Label]['Parameters']>(tag: Tag, value: z.infer<State['ParametersExclusive'][Label]['Parameters'][Tag]['Schema']>) => BuilderExclusiveAfterDefault<State.SetExclusiveOptional<State, Label, false>>;
}
export type BuilderExclusiveAfterOptional<State extends State.Base> = {
    _: InternalState<State>;
};
export type BuilderExclusiveAfterDefault<State extends State.Base> = {
    _: InternalState<State>;
};
export interface BuilderAfterSettings<Spec extends State.Base> {
    parse: (inputs?: RawArgInputs) => State.ToArgs<Spec>;
}
export interface SomeParameter {
    (nameExpression: any, type: ParameterSpec.SomeExclusiveZodType): any;
    (nameExpression: any, configuration: ExclusiveParameterConfiguration): any;
}
export type SomeBuilderExclusiveInitial = {
    _: any;
    parameter: SomeParameter;
    optional: any;
    default: (tag: any, value: any) => any;
};
export type SomeBuilderMutuallyExclusiveAfterOptional = BuilderExclusiveAfterOptional<State.Base>;
export type SomeBuilderExclusive = SomeBuilderExclusiveInitial | SomeBuilderMutuallyExclusiveAfterOptional;
export {};
//# sourceMappingURL=types.d.ts.map