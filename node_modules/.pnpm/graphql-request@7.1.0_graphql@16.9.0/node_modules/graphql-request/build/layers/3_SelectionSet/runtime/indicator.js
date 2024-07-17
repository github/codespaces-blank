export const isIndicator = (v) => {
    return String(v) in indicator;
};
export const isPositiveIndicator = (v) => {
    return !(String(v) in negativeIndicator);
};
const negativeIndicator = {
    '0': 0,
    'false': false,
    'undefined': undefined,
};
const positiveIndicator = {
    '1': 1,
    'true': true,
};
const indicator = {
    ...negativeIndicator,
    ...positiveIndicator,
};
//# sourceMappingURL=indicator.js.map