import type { ParameterSpec } from '../ParameterSpec/index.js';
export interface ArgumentReport extends Argument {
    spec: ParameterSpec.Output;
    duplicates: Argument[];
    errors: Error[];
}
export interface Argument {
    value: Value;
    source: ArgumentSource;
}
export type Value = {
    _tag: 'boolean';
    value: boolean;
    negated: boolean;
} | {
    _tag: 'number';
    value: number;
} | {
    _tag: 'string';
    value: string;
};
type ArgumentSource = LineSource | EnvironmentSource;
interface LineSource {
    _tag: 'line';
    name: string;
}
interface EnvironmentSource {
    _tag: 'environment';
    name: string;
    namespace: null | string;
}
export {};
//# sourceMappingURL=types.d.ts.map