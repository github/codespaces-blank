import type { Errors } from '../Errors/index.js'
import type { ParameterSpec } from '../ParameterSpec/index.js'
import type { Environment } from './Environment/index.js'
import type { LocalParseErrors } from './Line/Line.js'

export interface EnvironmentArgumentReport<Spec extends ParameterSpec.Output = ParameterSpec.Output>
  extends Argument {
  spec: Spec
  errors: Environment.LocalParseErrors[]
}

export interface ArgumentReport<Spec extends ParameterSpec.Output = ParameterSpec.Output> extends Argument {
  spec: Spec
  errors: LocalParseErrors[]
}

export interface Argument {
  value: Value
  source: ArgumentSource
}

export type Value =
  | { _tag: 'boolean'; value: boolean; negated: boolean }
  | { _tag: 'number'; value: number }
  | { _tag: 'string'; value: string }

type ArgumentSource = LineSource | EnvironmentSource

interface LineSource {
  _tag: 'line'
  name: string
}

interface EnvironmentSource {
  _tag: 'environment'
  name: string
  namespace: null | string
}

export type ParseErrorGlobal =
  | Errors.Global.ErrorUnknownFlag
  | Errors.Global.ErrorUnknownParameterViaEnvironment

export type ParseErrorBasic =
  | Errors.ErrorMissingArgument
  | Errors.ErrorInvalidArgument
  | Errors.ErrorFailedToGetDefaultArgument
  | Errors.ErrorDuplicateEnvArg
  | Errors.ErrorDuplicateLineArg

export type ParseErrorExclusiveGroup =
  | Errors.ErrorArgumentsToMutuallyExclusiveParameters
  | Errors.ErrorMissingArgumentForMutuallyExclusiveParameters
  | ParseErrorBasic

export type ParseError =
  | ParseErrorBasic
  | ParseErrorExclusiveGroup
  | Errors.ErrorDuplicateEnvArg
  | LocalParseErrors

export type ParseResultBasicSupplied = {
  _tag: 'supplied'
  spec: ParameterSpec.Output.Basic | ParameterSpec.Output.Union
  value: ParameterSpec.ArgumentValue
}

export type ParseResultBasicError = {
  _tag: 'error'
  spec: ParameterSpec.Output.Basic | ParameterSpec.Output.Union
  errors: ParseErrorBasic[]
}
export type ParseResultBasicOmitted = {
  _tag: 'omitted'
  spec: ParameterSpec.Output.Basic | ParameterSpec.Output.Union
}

export type ParseResultBasic = ParseResultBasicSupplied | ParseResultBasicError | ParseResultBasicOmitted

export type ParseResultExclusiveGroupSupplied = {
  _tag: 'supplied'
  spec: ParameterSpec.Output.ExclusiveGroup
  parameter: ParameterSpec.Output.Exclusive
  value: ParameterSpec.ArgumentValueMutuallyExclusive
}

export type ParseResultExclusiveGroupError = {
  _tag: 'error'
  spec: ParameterSpec.Output.ExclusiveGroup
  errors: ParseErrorExclusiveGroup[]
}

export type ParseResultExclusiveGroup =
  | ParseResultExclusiveGroupSupplied
  | {
      _tag: 'omitted'
      spec: ParameterSpec.Output.ExclusiveGroup
    }
  | ParseResultExclusiveGroupError

export type ParseResult = {
  globalErrors: ParseErrorGlobal[]
  basicParameters: Record<string, ParseResultBasic>
  mutuallyExclusiveParameters: Record<string, ParseResultExclusiveGroup>
}
