import type { EventPatternsInput } from '../eventPatterns.js'
import type { ParameterSpec } from './index.js'
import type { ArgumentValueScalar, SomeBasicType, Type } from './types.js'

export type Output = Output.Exclusive | Output.Basic | Output.Union

export namespace Output {
  export type Prompt<S extends ParameterSpec.Input.Schema = ParameterSpec.Input.Schema> = {
    enabled: boolean | null
    when: EventPatternsInput<S> | null
  }

  export interface Basic {
    _tag: 'Basic'
    name: Name
    type: Type
    optionality: BasicOptionality
    description: null | string
    environment: Environment
    prompt: Prompt
  }

  export type BasicData = Omit<Basic, '_tag' | 'optionality'> & {
    _tag: 'BasicData'
    optionality: BasicOptionality['_tag']
  }

  export interface Union {
    _tag: 'Union'
    name: Name
    types: {
      type: Type
      zodType: SomeBasicType
      description: null | string
    }[]
    optionality: BasicOptionality
    description: null | string
    environment: Environment
  }
  export type UnionData = Omit<Union, '_tag' | 'optionality' | 'types'> & {
    _tag: 'UnionData'
    optionality: BasicOptionality['_tag']
    types: {
      type: Type
      description: null | string
    }[]
  }

  export interface Exclusive {
    _tag: 'Exclusive'
    name: Name
    type: Type
    description: string | null
    environment: Environment
    group: ExclusiveGroup
  }

  // prettier-ignore
  export type BasicOptionality = 
    | { _tag: 'required' }
    | { _tag: 'optional' }
    | { _tag: 'default', getValue: () => ArgumentValueScalar }

  export type ExclusiveOptionality =
    | { _tag: 'required' }
    | { _tag: 'optional' }
    | { _tag: 'default'; tag: string; getValue: () => ArgumentValueScalar }

  export type Environment = null | { enabled: boolean; namespaces: string[] }

  export interface Name {
    canonical: string
    aliases: {
      short: string[]
      long: string[]
    }
    short: null | string
    long: null | string
  }

  export interface ExclusiveGroup {
    // _tag: 'Exclusive'
    label: string
    optionality: ExclusiveOptionality
    parameters: Record<string, Exclusive>
  }
}
