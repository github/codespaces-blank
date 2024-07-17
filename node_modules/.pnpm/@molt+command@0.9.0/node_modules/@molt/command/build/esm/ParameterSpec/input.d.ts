import type { EventPatternsInput } from '../eventPatterns.js';
import type { ArgumentValueScalar, SomeBasicType, SomeExclusiveZodType, SomeUnionType } from './types.js';
export type Input = Input.Basic | Input.Exclusive | Input.Union;
export declare namespace Input {
    type Schema = SomeBasicType | SomeUnionType;
    type Prompt<S extends Schema> = null | boolean | {
        enabled?: boolean;
        when?: EventPatternsInput<S>;
    };
    interface Basic {
        _tag: 'Basic';
        nameExpression: string;
        type: SomeBasicType;
        prompt: Prompt<SomeBasicType>;
    }
    interface Exclusive {
        _tag: 'Exclusive';
        optionality: {
            _tag: 'required';
        } | {
            _tag: 'optional';
        } | {
            _tag: 'default';
            tag: string;
            value: ArgumentValueScalar | (() => ArgumentValueScalar);
        };
        description?: string;
        parameters: {
            nameExpression: string;
            type: SomeExclusiveZodType;
        }[];
    }
    interface Union {
        _tag: 'Union';
        description?: string;
        nameExpression: string;
        type: SomeUnionType;
    }
}
//# sourceMappingURL=input.d.ts.map