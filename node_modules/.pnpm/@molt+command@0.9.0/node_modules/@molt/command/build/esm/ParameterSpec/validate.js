import { Patterns } from '../lib/Patterns/index.js';
import { Alge } from 'alge';
import { z } from 'zod';
export const Result = Alge.data(`Result`, {
    Success: z.object({
        value: z.any(),
    }),
    Failure: z.object({
        errors: z.array(z.string()),
        value: z.any(),
    }),
});
export const validate = (spec, value) => {
    return Alge.match(spec)
        .Basic((spec) => validateBasic(spec, value))
        .Union((spec) => validateUnion(spec, value))
        .Exclusive((spec) => validateExclusive(spec, value))
        .done();
};
const validateBasic = (spec, value) => {
    if (value === undefined) {
        if (spec.optionality._tag === `required`) {
            // @ts-expect-error todo alge generics
            return Result.Failure.create({ value, errors: [`Value is undefined. A value is required.`] });
        }
        // @ts-expect-error todo alge generics
        return Result.Success.create({ value });
    }
    return validateType(spec.type, value);
};
const validateUnion = (spec, value) => {
    if (value === undefined) {
        if (spec.optionality._tag === `required`) {
            // @ts-expect-error todo alge generics
            return Result.Failure.create({ value, errors: [`Value is undefined. A value is required.`] });
        }
        // @ts-expect-error todo alge generics
        return Result.Success.create({ value });
    }
    const type = spec.types.find((member) => validateType(member.type, value));
    if (!type) {
        // @ts-expect-error todo alge generics
        return Result.Failure.create({ value, errors: [`Value does not fit any member of the union.`] });
    }
    // @ts-expect-error todo alge generics
    return Result.Success.create({ value });
};
const validateExclusive = (_spec, _value) => {
    // todo do we need this?
    return null;
};
const validateType = (type, value) => {
    // @ts-expect-error todo alge generics
    return Alge.match(type)
        .TypeLiteral((_) => value === _.value
        ? Result.Success.create({ value })
        : Result.Failure.create({ value, errors: [`Value is not equal to literal.`] }))
        .TypeBoolean(() => typeof value === `boolean`
        ? Result.Success.create({ value })
        : Result.Failure.create({ value, errors: [`Value is not a boolean.`] }))
        .TypeEnum((type) => type.members.includes(value)
        ? Result.Success.create({ value })
        : Result.Failure.create({ value, errors: [`Value is not a member of the enum.`] }))
        .TypeNumber((type) => {
        const errors = [];
        if (typeof value !== `number`) {
            return Result.Failure.create({ value, errors: [`Value is not a number.`] });
        }
        if (type.int && !Number.isInteger(value)) {
            errors.push(`Value is not an integer.`);
        }
        if (type.min) {
            if (value < type.min) {
                errors.push(`value must be bigger than ${type.min}.`);
            }
        }
        if (type.max) {
            if (value > type.max) {
                errors.push(`value must be smaller than ${type.max}.`);
            }
        }
        if (type.multipleOf) {
            if (value % type.multipleOf !== 0) {
                errors.push(`Value is not a multiple of ${type.multipleOf}.`);
            }
        }
        if (errors.length > 0) {
            return Result.Failure.create({ value, errors });
        }
        return Result.Success.create({ value });
    })
        .TypeString((type) => {
        const errors = [];
        if (typeof value !== `string`) {
            return Result.Failure.create({ value, errors: [`Value is not a string.`] });
        }
        if (type.regex && !type.regex.test(value)) {
            errors.push(`Value does not conform to Regular Expression.`);
        }
        if (type.min) {
            if (value.length < type.min) {
                errors.push(`Value is too short.`);
            }
        }
        if (type.max) {
            if (value.length > type.max) {
                errors.push(`Value is too long.`);
            }
        }
        if (type.includes) {
            if (!value.includes(type.includes)) {
                errors.push(`Value does not include ${type.includes}.`);
            }
        }
        if (type.pattern) {
            Alge.match(type.pattern)
                .cuid(() => {
                if (!Patterns.cuid.test(value)) {
                    errors.push(`Value is not a cuid.`);
                }
            })
                .url(() => {
                try {
                    new URL(value);
                }
                catch (error) {
                    errors.push(`Value is not a URL.`);
                }
            })
                .email(() => {
                if (!Patterns.email.test(value)) {
                    errors.push(`Value is not an email address.`);
                }
            })
                .uuid(() => {
                if (!Patterns.uuid.test(value)) {
                    errors.push(`Value is not a uuid.`);
                }
            })
                .ulid(() => {
                if (!Patterns.ulid.test(value)) {
                    errors.push(`Value is not a ulid.`);
                }
            })
                .dateTime((type) => {
                if (!Patterns.dateTime({ offset: type.offset, precision: type.precision }).test(value)) {
                    errors.push(`Value is not a conforming datetime.`);
                }
            })
                .cuid2(() => {
                if (!Patterns.cuid2.test(value)) {
                    errors.push(`Value is not a cuid2.`);
                }
            })
                .ip((type) => {
                const ip4 = Patterns.ipv4.test(value);
                if (type.version === 4 && !ip4) {
                    errors.push(`Value is not an ipv4 address.`);
                    return;
                }
                const ip6 = Patterns.ipv6.test(value);
                if (type.version === 6 && !ip6) {
                    errors.push(`Value is not an ipv6 address.`);
                    return;
                }
                if (!ip4 && !ip6) {
                    errors.push(`Value is not an ipv4 or ipv6 address.`);
                }
            })
                .emoji(() => {
                if (!Patterns.emoji.test(value)) {
                    errors.push(`Value is not an emoji.`);
                }
            })
                .done();
        }
        if (type.startsWith) {
            if (!value.startsWith(type.startsWith)) {
                errors.push(`Value does not start with ${type.startsWith}.`);
            }
        }
        if (type.endsWith) {
            if (!value.endsWith(type.endsWith)) {
                errors.push(`Value does not end with ${type.endsWith}.`);
            }
        }
        if (type.length) {
            if (value.length !== type.length) {
                errors.push(`Value does not have the length ${type.length}.`);
            }
        }
        if (errors.length > 0) {
            return Result.Failure.create({ value, errors });
        }
        return Result.Success.create({ value });
    })
        .done();
};
//# sourceMappingURL=validate.js.map