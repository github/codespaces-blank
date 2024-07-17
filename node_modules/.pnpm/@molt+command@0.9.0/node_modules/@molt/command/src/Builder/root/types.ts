import type { OpeningArgs } from '../../OpeningArgs/index.js'
import type { ParameterSpec } from '../../ParameterSpec/index.js'
import type { TTY } from '../../parse/prompt.js'
import type { Settings } from '../../Settings/index.js'
import type {
  BuilderAfterSettings,
  BuilderExclusiveInitial,
  SomeBuilderExclusive,
} from '../exclusive/types.js'
// eslint-disable-next-line
import { State } from '../State.js'

export type Schema = ParameterSpec.SomeBasicType | ParameterSpec.SomeUnionType

export interface ParameterConfiguration {
  schema: Schema
  prompt?: ParameterSpec.Input.Prompt<this['schema']>
}

export type IsHasKey<Obj extends object, Key> = Key extends keyof Obj ? true : false

// prettier-ignore
export type IsPromptEnabledInParameterSettings<P extends ParameterConfiguration> =
  IsHasKey<P,'prompt'>                                      extends false     ? false :
                                                                                IsPromptEnabled<P['prompt']>
// prettier-ignore
export type IsPromptEnabledInCommandSettings<P extends Settings.Input<any>> =
  IsHasKey<P,'prompt'>                                      extends false     ? false :
                                                                                IsPromptEnabled<P['prompt']>

// prettier-ignore
export type IsPromptEnabled<P extends ParameterSpec.Input.Prompt<any>|undefined> =
  P                                               extends undefined ? false :
  P                                               extends false     ? false :
  P                                               extends true      ? true  :
  P                                               extends null      ? false :
  Exclude<P, undefined|boolean|null>['enabled']   extends false     ? false :
                                                                      true

export interface SomeParameterConfig<S extends Schema> {
  schema: S
  prompt?: ParameterSpec.Input.Prompt<S>
}

// prettier-ignore
export interface RootBuilder<State extends State.Base = State.BaseEmpty> {
  s: State
  description                                                                               (this:void, description:string):
    RootBuilder<State>
  parameter<NameExpression extends string, const Configuration extends ParameterConfiguration>    (this:void, name:State.ValidateNameExpression<State,NameExpression>, configuration:Configuration):
    RootBuilder<{
      IsPromptEnabled    : State['IsPromptEnabled'] extends true ? true : IsPromptEnabledInParameterSettings<Configuration>
      ParametersExclusive: State['ParametersExclusive']
      Parameters         : State['Parameters'] & { [_ in NameExpression]: State.CreateParameter<State,NameExpression,Configuration> }
    }>
  parameter<NameExpression extends string, S extends Schema>                                (this:void, name:State.ValidateNameExpression<State,NameExpression>, schema:S):
    RootBuilder<{
      IsPromptEnabled    : State['IsPromptEnabled']
      ParametersExclusive: State['ParametersExclusive']
      Parameters         : State['Parameters'] & { [_ in NameExpression]: State.CreateParameter<State,NameExpression,{schema:S}> }
    }>
  parametersExclusive<Label extends string, BuilderExclusive extends SomeBuilderExclusive>  (this:void, label:Label, ExclusiveBuilderContainer: (builder:BuilderExclusiveInitial<State,Label>) => BuilderExclusive):
    RootBuilder<BuilderExclusive['_']['typeState']>
  settings                                                                                  <S extends Settings.Input<State.ToSchema<State>>>(this:void, newSettings:S):
    BuilderAfterSettings<{
      IsPromptEnabled    : State['IsPromptEnabled'] extends true ? true : IsPromptEnabledInCommandSettings<S>
      ParametersExclusive: State['ParametersExclusive']
      Parameters         : State['Parameters']
    }>
  parse                                                                                     (this:void, inputs?:RawArgInputs):
    State.ToArgs<State>
}

export type RawArgInputs = {
  line?: OpeningArgs.Line.RawInputs
  environment?: OpeningArgs.Environment.RawInputs
  tty?: TTY
}

export type SomeArgsNormalized = Record<string, unknown>
