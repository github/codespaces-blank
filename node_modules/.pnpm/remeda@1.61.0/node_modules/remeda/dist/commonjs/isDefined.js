"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDefined = void 0;
function isDefined(data) {
    return data !== undefined && data !== null;
}
exports.isDefined = isDefined;
(function (isDefined) {
    function strict(data) {
        return data !== undefined;
    }
    isDefined.strict = strict;
})(isDefined || (exports.isDefined = isDefined = {}));
