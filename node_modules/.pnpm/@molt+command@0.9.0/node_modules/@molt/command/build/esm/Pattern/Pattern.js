export const _ = `*`;
export const match = (data, pattern) => {
    if (pattern === _) {
        return true;
    }
    /**
     * If the _data_ is an array, then the OR _pattern_ must be lifted up on level
     */
    if (Array.isArray(data)) {
        if (!Array.isArray(pattern)) {
            throw new Error(`Invalid pattern for data.\nPattern: ${pattern?.toString()}\nData: ${data.toString()}`);
        }
        const isOrKindPattern = pattern.filter((_) => Array.isArray(_)).length === pattern.length;
        if (isOrKindPattern) {
            return pattern.some((_) => match(data, _));
        }
        // Singular Kind Pattern
        if (pattern.length !== data.length) {
            // If we don't have same-length arrays then we know it's not a match.
            return false;
        }
        // Although we only iterate the data members we know its length is the same as the pattern.
        const isAllMembersMatch = data.filter((_, i) => match(_, pattern[i])).length === data.length;
        return isAllMembersMatch;
    }
    if (Array.isArray(pattern)) {
        return pattern.some((_) => match(data, _));
    }
    const patternType = typeof pattern;
    if (patternType === `undefined` || patternType === `function`) {
        return false;
    }
    if (typeof pattern === `object` && pattern !== null) {
        if (!(typeof data === `object` && data !== null)) {
            return false;
        }
        const valuePatterns = Object.entries(pattern);
        if (valuePatterns.length === 0) {
            return true;
        }
        return valuePatterns
            .map(([key, valuePattern]) => {
            if (!(key in data)) {
                return false;
            }
            // eslint-disable-next-line
            return match(data[key], valuePattern);
        })
            .reduce((all, next) => all && next, true);
    }
    return pattern === data;
};
//# sourceMappingURL=Pattern.js.map