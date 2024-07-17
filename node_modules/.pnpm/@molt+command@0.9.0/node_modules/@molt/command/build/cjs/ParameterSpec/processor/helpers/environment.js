"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processEnvironment = void 0;
const lodash_camelcase_1 = __importDefault(require("lodash.camelcase"));
/**
 * Parse the specification for a parameter's environment support.
 */
const processEnvironment = (settings, name) => {
    const hasEnvironment = settings.parameters.environment[name.canonical]?.enabled ??
        settings.parameters.environment.$default.enabled;
    return hasEnvironment
        ? {
            enabled: hasEnvironment,
            namespaces: (settings.parameters.environment[name.canonical]?.prefix ??
                settings.parameters.environment.$default.prefix).map((_) => (0, lodash_camelcase_1.default)(_)),
        }
        : null;
};
exports.processEnvironment = processEnvironment;
//# sourceMappingURL=environment.js.map