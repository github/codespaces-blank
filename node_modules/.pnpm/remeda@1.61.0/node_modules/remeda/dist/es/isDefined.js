export function isDefined(data) {
    return data !== undefined && data !== null;
}
(function (isDefined) {
    function strict(data) {
        return data !== undefined;
    }
    isDefined.strict = strict;
})(isDefined || (isDefined = {}));
