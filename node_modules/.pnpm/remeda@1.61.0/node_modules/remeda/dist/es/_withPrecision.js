var MAX_PRECISION = 15;
export function _withPrecision(roundingFn) {
    return function (value, precision) {
        if (precision === 0) {
            return roundingFn(value);
        }
        if (!Number.isInteger(precision)) {
            throw new TypeError("precision must be an integer: ".concat(precision));
        }
        if (precision > MAX_PRECISION || precision < -MAX_PRECISION) {
            throw new RangeError("precision must be between -15 and 15");
        }
        if (Number.isNaN(value) || !Number.isFinite(value)) {
            return roundingFn(value);
        }
        var multiplier = Math.pow(10, precision);
        return roundingFn(value * multiplier) / multiplier;
    };
}
