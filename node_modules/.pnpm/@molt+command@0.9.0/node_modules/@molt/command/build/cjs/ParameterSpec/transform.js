"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transform = void 0;
const helpers_js_1 = require("../helpers.js");
const alge_1 = require("alge");
/**
 * Apply transformations specific in the parameter. For example strings can be trimmed.
 */
const transform = (spec, value) => {
    return alge_1.Alge.match(spec)
        .Basic((spec) => transformBasic(spec, value))
        .Union((spec) => transformUnion(spec, value))
        .Exclusive((spec) => transformExclusive(spec, value))
        .done();
};
exports.transform = transform;
const transformBasic = (spec, value) => {
    if (spec.type._tag === `TypeString`) {
        if (typeof value === `string`) {
            if (spec.type.transformations) {
                (0, helpers_js_1.entries)(spec.type.transformations ?? {}).reduce((v, t) => {
                    return t[0] === `trim`
                        ? v.trim()
                        : t[0] === `toCase`
                            ? t[1] === `upper`
                                ? v.toUpperCase()
                                : v.toLowerCase()
                            : (0, helpers_js_1.casesExhausted)(t[0]);
                }, value);
                let value_ = value;
                if (spec.type.transformations?.trim) {
                    value_ = value_.trim();
                }
                if (spec.type.transformations?.toCase) {
                    if (spec.type.transformations.toCase === `upper`) {
                        value_ = value_.toUpperCase();
                    }
                    else if (spec.type.transformations.toCase === `lower`) {
                        value_ = value_.toLowerCase();
                    }
                }
                return value_;
            }
        }
    }
    return value;
};
const transformUnion = (_spec, value) => {
    // TODO how do we handle this?
    // If one member has trim, how do we know if we should apply the transformation before
    // assigning the value to it via the validation? But we need trim before validation??
    // throw new Error(`todo`)
    return value;
};
const transformExclusive = (_spec, _value) => {
    // todo do we need this?
    return null;
};
//# sourceMappingURL=transform.js.map