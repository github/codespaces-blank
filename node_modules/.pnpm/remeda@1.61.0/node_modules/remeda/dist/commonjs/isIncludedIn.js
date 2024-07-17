"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isIncludedIn = void 0;
function isIncludedIn(dataOrContainer, container) {
    if (container === undefined) {
        var asSet_1 = new Set(dataOrContainer);
        return function (data) { return asSet_1.has(data); };
    }
    return container.indexOf(dataOrContainer) >= 0;
}
exports.isIncludedIn = isIncludedIn;
