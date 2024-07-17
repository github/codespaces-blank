import type { EventPatternsInput } from '../eventPatterns.js';
import type { ParameterSpec } from './index.js';
import type { ArgumentValueScalar, SomeBasicType, Type } from './types.js';
export type Output = Output.Exclusive | Output.Basic | Output.Union;
export declare namespace Output {
    type Prompt<S extends ParameterSpec.Input.Schema = ParameterSpec.Input.Schema> = {
        enabled: boolean | null;
        when: EventPatternsInput<S> | null;
    };
    interface Basic {
        _tag: 'Basic';
        name: Name;
        type: Type;
        optionality: BasicOptionality;
        description: null | string;
        environment: Environment;
        prompt: Prompt;
    }
    type BasicData = Omit<Basic, '_tag' | 'optionality'> & {
        _tag: 'BasicData';
        optionality: BasicOptionality['_tag'];
    };
    interface Union {
        _tag: 'Union';
        name: Name;
        types: {
            type: Type;
            zodType: SomeBasicType;
            description: null | string;
        }[];
        optionality: BasicOptionality;
        description: null | string;
        environment: Environment;
    }
    type UnionData = Omit<Union, '_tag' | 'optionality' | 'types'> & {
        _tag: 'UnionData';
        optionality: BasicOptionality['_tag'];
        types: {
            type: Type;
            description: null | string;
        }[];
    };
    interface Exclusive {
        _tag: 'Exclusive';
        name: Name;
        type: Type;
        description: string | null;
        environment: Environment;
        group: ExclusiveGroup;
    }
    type BasicOptionality = {
        _tag: 'required';
    } | {
        _tag: 'optional';
    } | {
        _tag: 'default';
        getValue: () => ArgumentValueScalar;
    };
    type ExclusiveOptionality = {
        _tag: 'required';
    } | {
        _tag: 'optional';
    } | {
        _tag: 'default';
        tag: string;
        getValue: () => ArgumentValueScalar;
    };
    type Environment = null | {
        enabled: boolean;
        namespaces: string[];
    };
    interface Name {
        canonical: string;
        aliases: {
            short: string[];
            long: string[];
        };
        short: null | string;
        long: null | string;
    }
    interface ExclusiveGroup {
        label: string;
        optionality: ExclusiveOptionality;
        parameters: Record<string, Exclusive>;
    }
}
//# sourceMappingURL=output.d.ts.map