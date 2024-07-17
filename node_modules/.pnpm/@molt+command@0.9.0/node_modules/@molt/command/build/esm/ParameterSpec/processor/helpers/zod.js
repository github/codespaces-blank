import { getBasicScalar } from '../../types.js';
import { Alge } from 'alge';
import { z } from 'zod';
export const analyzeZodTypeScalar = (zodType) => {
    let description = zodType.description ?? null;
    let primitiveType = zodType;
    while (primitiveType._def.typeName === z.ZodFirstPartyTypeKind.ZodDefault ||
        primitiveType._def.typeName === z.ZodFirstPartyTypeKind.ZodOptional) {
        description = description ?? primitiveType._def.innerType.description ?? null;
        primitiveType = primitiveType._def.innerType;
    }
    const zodTypeScalar = getBasicScalar(primitiveType);
    const type = zodTypeScalar._def.typeName === z.ZodFirstPartyTypeKind.ZodLiteral
        ? { _tag: `TypeLiteral`, value: zodTypeScalar._def.value }
        : zodTypeScalar._def.typeName === z.ZodFirstPartyTypeKind.ZodString
            ? { _tag: `TypeString`, ...mapZodStringChecks(zodTypeScalar._def.checks) }
            : zodTypeScalar._def.typeName === z.ZodFirstPartyTypeKind.ZodBoolean
                ? { _tag: `TypeBoolean` }
                : zodTypeScalar._def.typeName === z.ZodFirstPartyTypeKind.ZodNumber
                    ? { _tag: `TypeNumber`, ...mapZodNumberChecks(zodTypeScalar._def.checks) }
                    : zodTypeScalar._def.typeName === z.ZodFirstPartyTypeKind.ZodNativeEnum
                        ? { _tag: `TypeEnum`, members: Object.values(zodTypeScalar._def.values) }
                        : zodTypeScalar._def.typeName === z.ZodFirstPartyTypeKind.ZodEnum
                            ? { _tag: `TypeEnum`, members: zodTypeScalar._def.values }
                            : null;
    if (!type)
        throw new Error(`Unsupported zod type: ${zodTypeScalar._def.typeName}`);
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
                .emoji((_) => ({
                pattern: { type: _._tag },
            }))
                .ip((_) => ({
                pattern: {
                    type: _._tag,
                    version: _.version
                        ? Alge.match(_.version)
                            .v4(() => 4)
                            .v6(() => 6)
                            .done()
                        : null,
                },
            }))
                .ulid((_) => ({
                pattern: { type: _._tag },
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
                .includes((_) => ({
                includes: _.value,
            }))
                // transformations
                .trim(() => ({
                transformations: {
                    ...acc.transformations,
                    trim: true,
                },
            }))
                .toLowerCase(() => ({
                transformations: {
                    ...acc.transformations,
                    toCase: `lower`,
                },
            }))
                .toUpperCase(() => ({
                transformations: {
                    ...acc.transformations,
                    toCase: `upper`,
                },
            }))
                .done(),
        };
    }, {});
};
//# sourceMappingURL=zod.js.map