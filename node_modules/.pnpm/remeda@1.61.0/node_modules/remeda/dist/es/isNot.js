export function isNot(predicate) {
    return function (data) { return !predicate(data); };
}
