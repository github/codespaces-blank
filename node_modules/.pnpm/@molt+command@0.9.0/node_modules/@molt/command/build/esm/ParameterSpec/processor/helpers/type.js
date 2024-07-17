import { getBasicScalar } from '../../types.js';
import { Alge } from 'alge';
export const analyzeZodTypeScalar = (zodType) => {
    let description = zodType.description ?? null;
    let primitiveType = zodType;
    while (primitiveType._def.typeName === `ZodDefault` || primitiveType._def.typeName === `ZodOptional`) {
        description = description ?? primitiveType._def.innerType.description ?? null;
        primitiveType = primitiveType._def.innerType;
    }
    const zodTypeScalar = getBasicScalar(primitiveType);
    const type = zodTypeScalar._def.typeName === `ZodString`
        ? { _tag: `TypeString`, ...mapZodStringChecks(zodTypeScalar._def.checks) }
        : zodTypeScalar._def.typeName === `ZodBoolean`
            ? { _tag: `TypeBoolean` }
            : zodTypeScalar._def.typeName === `ZodNumber`
                ? { _tag: `TypeNumber`, ...mapZodNumberChecks(zodTypeScalar._def.checks) }
                : { _tag: `TypeEnum`, members: zodTypeScalar._def.values };
    return {
        description,
        type,
    };
};
const mapZodNumberChecks = (checks) => {
    return checks
        .map((_) => ({ _tag: _.kind, ..._ }))
        .reduce((acc, check) => {
        return Alge.match(check)
            .int(() => ({ ...acc, int: true }))
            .min((check) => ({
            min: check.value,
        }))
            .max((check) => ({
            max: check.value,
        }))
            .finite(() => ({
            finite: true,
        }))
            .multipleOf((check) => ({
            multipleOf: check.value,
        }))
            .done();
    }, {});
};
const mapZodStringChecks = (checks) => {
    return checks
        .map((_) => ({ _tag: _.kind, ..._ }))
        .reduce((acc, check) => {
        return {
            ...acc,
            ...Alge.match(check)
                .regex((check) => ({
                regex: check.regex,
            }))
                .min((check) => ({
                min: check.value,
            }))
                .max((check) => ({
                max: check.value,
            }))
                .url((check) => ({
                pattern: { type: check._tag },
            }))
                .cuid((check) => ({
                pattern: { type: check._tag },
            }))
                .cuid2(() => ({
                pattern: { type: `cuid2` },
            }))
                .uuid((check) => ({
                pattern: { type: check._tag },
            }))
                .datetime((check) => ({
                pattern: {
                    type: `dateTime`,
                    offset: check.offset,
                    precision: check.precision,
                },
            }))
                .email((check) => ({
                pattern: { type: check._tag },
            }))
                .endsWith((check) => ({
                endsWith: check.value,
            }))
                .startsWith((check) => ({
                startsWith: check.value,
            }))
                .length((check) => ({
                length: check.value,
            }))
                .trim(() => ({
                transformations: {
                    ...acc.transformations,
                    trim: true,
                },
            }))
                .done(),
        };
    }, {});
};
//# sourceMappingURL=type.js.map