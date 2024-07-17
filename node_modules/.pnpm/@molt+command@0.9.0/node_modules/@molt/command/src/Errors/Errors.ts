import type { OpeningArgs } from '../OpeningArgs/index.js'
import type { ParameterSpec } from '../ParameterSpec/index.js'

export namespace Global {
  export class ErrorUnknownParameterViaEnvironment extends Error {
    public override name: 'ErrorUnknownParameterViaEnvironment' = `ErrorUnknownParameterViaEnvironment`
    public prefix: null | string
    constructor(params: { flagName: string; prefix: null | string }) {
      const message = `Unknown parameter "${params.flagName}"`
      super(message)
      this.prefix = params.prefix
    }
  }

  export class ErrorUnknownFlag extends Error {
    public override name: 'ErrorUnknownFlag' = `ErrorUnknownFlag`
    constructor(params: { flagName: string }) {
      const message = `Unknown flag "${params.flagName}"`
      super(message)
    }
  }
}

export class ErrorDuplicateLineArg extends Error {
  public override name: 'ErrorDuplicateFlag' = `ErrorDuplicateFlag`
  public spec: ParameterSpec.Output
  constructor(params: { spec: ParameterSpec.Output; flagName: string }) {
    const message = `The parameter "${params.flagName}" was passed an argument multiple times via flags.`
    super(message)
    this.spec = params.spec
  }
}

export class ErrorDuplicateEnvArg extends Error {
  public override name: 'ErrorDuplicateEnvArg' = `ErrorDuplicateEnvArg`
  public spec: ParameterSpec.Output
  public instances: { value: string; name: string; prefix: string | null }[]
  constructor(params: {
    spec: ParameterSpec.Output
    instances: { value: string; name: string; prefix: string | null }[]
  }) {
    const message = `The parameter "${params.spec.name.canonical}" was passed an argument multiple times via different parameter aliases in the environment.`
    super(message)
    this.spec = params.spec
    this.instances = params.instances
  }
}

export class ErrorFailedToGetDefaultArgument extends Error {
  public override name: 'ErrorFailedToGetDefaultArgument' = `ErrorFailedToGetDefaultArgument`
  public spec: ParameterSpec.Output
  constructor(params: { spec: ParameterSpec.Output; cause: Error }) {
    const message = `Failed to get default value for ${params.spec.name.canonical}`
    super(message, { cause: params.cause })
    this.spec = params.spec
  }
}

export class ErrorMissingArgument extends Error {
  public override name: 'ErrorMissingArgument' = `ErrorMissingArgument`
  public spec: ParameterSpec.Output
  constructor(params: { spec: ParameterSpec.Output }) {
    const message = `Missing argument for flag "${params.spec.name.canonical}".`
    super(message)
    this.spec = params.spec
  }
}

export class ErrorMissingArgumentForMutuallyExclusiveParameters extends Error {
  public override name: 'ErrorMissingArgumentForMutuallyExclusiveParameters' = `ErrorMissingArgumentForMutuallyExclusiveParameters`
  public group: ParameterSpec.Output.ExclusiveGroup
  constructor(params: { group: ParameterSpec.Output.ExclusiveGroup }) {
    const message = `Missing argument for one of the following parameters: ${Object.values(
      params.group.parameters,
    )
      .map((_) => _.name.canonical)
      .join(`, `)}`
    super(message)
    this.group = params.group
  }
}

export class ErrorArgumentsToMutuallyExclusiveParameters extends Error {
  public override name: 'ErrorArgumentsToMutuallyExclusiveParameters' = `ErrorArgumentsToMutuallyExclusiveParameters`
  public group: ParameterSpec.Output.ExclusiveGroup
  constructor(params: { offenses: { spec: ParameterSpec.Output.Exclusive; arg: OpeningArgs.Argument }[] }) {
    const message = `Arguments given to multiple mutually exclusive parameters: ${params.offenses
      .map((_) => _.spec.name.canonical)
      .join(`, `)}`
    super(message)
    this.group = params.offenses[0]!.spec.group
  }
}

export class ErrorInvalidArgument extends Error {
  public override name: 'ErrorInvalidArgument' = `ErrorInvalidArgument`
  public spec: ParameterSpec.Output
  public value: unknown
  constructor(params: {
    spec: ParameterSpec.Output
    environmentVariableName?: string
    validationErrors: string[]
    value: unknown
  }) {
    const message = `Invalid argument${
      params.environmentVariableName
        ? ` (via environment variable "${params.environmentVariableName}") `
        : ` `
    }for parameter: "${params.spec.name.canonical}". The error was:\n${params.validationErrors.join(`\n`)}`
    super(message)
    this.spec = params.spec
    this.value = params.value
  }
}
