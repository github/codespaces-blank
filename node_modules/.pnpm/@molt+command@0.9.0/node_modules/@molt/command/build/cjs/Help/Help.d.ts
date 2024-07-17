import type { ParameterSpec } from '../ParameterSpec/index.js';
import type { Settings } from '../Settings/index.js';
interface RenderSettings {
    /**
     * Should parameter names be displayed with dash prefixes.
     * @defaultValue false
     */
    flagDash?: boolean;
    /**
     * Should the help output be colored?
     * @defaultValue true
     */
    color?: boolean;
}
export declare const render: (specs_: ParameterSpec.Output[], settings: Settings.Output, _settings?: RenderSettings) => string;
export {};
//# sourceMappingURL=Help.d.ts.map